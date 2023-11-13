import express from "express";
import productModel from "../services/productModel";

const store = async (req, res) => {
    let id = req.params.idSanPham;
    let product = await productModel.detailProduct(id);

    if (!req.session.cart || !Array.isArray(req.session.cart)) {
        req.session.cart = [];
    }

    let existingProduct = req.session.cart.find(item => item.idSanPham == id);
    if (existingProduct) {
        existingProduct.qty += 1;
    } else {
        product.qty = 1;
        req.session.cart.push(product);
    }
    // console.log(product);
    res.redirect('/cart');
}

const cart = async (req, res) => {
    let dataCart = req.session.cart;
    // console.log('gio',dataCart)

    if (!req.session.cart) {
        dataCart = []
    }
    return res.render('index', { data: { title: 'Giỏ hàng', page: 'cart/viewCart', rows: dataCart, getUrl: req.url } });
}
const clearProduct = (req, res) => {
    let id = req.params.idSanPham;
    let cart = req.session.cart;

    // Tìm sản phẩm cần xóa trong giỏ hàng
    const productIndex = cart.findIndex(item => item.idSanPham == id);

    if (productIndex !== -1) {
        // Xóa sản phẩm khỏi danh sách giỏ hàng
        cart.splice(productIndex, 1);

        // Cập nhật giỏ hàng trong req.session
        req.session.cart = cart;

        // Redirect người dùng đến trang giỏ hàng sau khi xóa sản phẩm
        res.redirect('/cart');
    } else {
        // Nếu không tìm thấy sản phẩm, có thể hiển thị thông báo lỗi hoặc thực hiện hành động phù hợp khác
        res.send('Sản phẩm không tồn tại trong giỏ hàng');
    }
}
const clearAll = (req, res) => {
    delete req.session.cart;
    res.redirect('/cart');
}
const update = (req, res) => {
    const quantities = req.body
    if (quantities && typeof quantities === 'object') {
        for (const key in quantities) {
          // Kiểm tra xem key có tồn tại trong quantities không
          if (Object.prototype.hasOwnProperty.call(quantities, key)) {
            // Sử dụng biểu thức chính quy để tách idsanpham và số lượng
            const match = key.match(/^qty\[(\d+)\]$/);
    
            if (match) {
              const id = match[1];
              const qty = quantities[key];
            //   tim id tuong ung de cap nhat so luong
              let product = req.session.cart.find(item => item.idSanPham == id);
              product.qty = qty
            }
          }
        }
      }    
    res.redirect('/cart');
};
export default {
    store,
    cart,
    clearAll,
    clearProduct,
    update
}