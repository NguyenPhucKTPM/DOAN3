import express from "express";
import productModel from "../services/productModel";

//admin
const getAllProduct = async (req, res) =>{
    let listProduct = await productModel.getAllProduct()
    return res.render('admin',{data:{title:'Danh sách sản phẩm',page:'product/listProduct',rows:listProduct,getUrl: req.url} });
}
const detailProduct = async (req, res) =>{
    let id = req.params.idSanPham
    let detailProduct = await productModel.detailProduct(id)
    return res.render('admin',{data:{title:'Chi tiết sản phẩm',page:'product/detailProduct',rows:detailProduct,getUrl: req.url} });
}
const createProduct =  (req, res) =>{
    return res.render('admin',{data:{title:'Thêm sản phẩm',page:'product/createProduct',getUrl: req.url} });
}
const insertProduct = async (req, res) =>{
    let {tenSanPham,idDanhMuc,khuyenMai,hinhAnh,noiBat,moTa} = req.body;
    let gia = req.body.gia.replace(/\./g, '');
    if(!tenSanPham || !idDanhMuc || !gia || !hinhAnh || !noiBat || !moTa) return res.render("admin",{data:{title:"Thêm thất bại",page:'product/createProduct', error:"Thông tin sản phẩm không được bỏ trống",getUrl:req.url} })
    await productModel.insertProduct(tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa)
    return res.render("admin",{data:{title:"Thêm thành công",page:'product/createProduct', noti:`Thêm sản phẩm thành công: ${tenSanPham} `,getUrl:req.url} })
}
const editProduct = async (req, res) =>{
    let id = req.params.idSanPham
    let detailProduct = await productModel.detailProduct(id)
    return res.render('admin',{data:{title:'Cập nhật sản phẩm',page:'product/updateProduct',rows:detailProduct,getUrl: req.url} });
}
const updateProduct = async(req, res) =>{
    let {tenSanPham,idDanhMuc,khuyenMai,hinhAnh,hinhAnhCu,noiBat,moTa,idSanPham} = req.body;
    let gia = req.body.gia.replace(/\./g, '');
    if(!hinhAnh){
        await productModel.updateProduct(tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnhCu,noiBat,moTa,idSanPham)
        res.redirect('/list-product')
    }else{
        await productModel.updateProduct(tenSanPham,idDanhMuc,gia,khuyenMai,hinhAnh,noiBat,moTa,idSanPham)
        res.redirect('/list-product')
    }
}
const deleteProduct = async (req, res) =>{
    let id = req.params.idSanPham
    await productModel.deleteProduct(id)
    res.redirect('/list-product')
}

//user
const viewProduct = async (req, res) =>{
    let idDanhMuc = req.params.idDanhMuc
    let tenDanhMuc = req.params.tenDanhMuc
    let productPhone = await productModel.viewProduct(idDanhMuc)
    return res.render("index",{data:{title:`Sản phẩm theo danh mục: ${tenDanhMuc}`,page:'product/viewProduct',rows:productPhone,getUrl: req.url} })
}
const viewDetailProduct = async (req, res) =>{
    let idSanPham = req.params.idSanPham
    let tenSanPham = req.params.tenSanPham
    let detailProduct = await productModel.detailProduct(idSanPham)
    return res.render("index",{data:{title:"Chi tiết sản phẩm",page:'product/viewDetailProduct',rows:detailProduct,getUrl: req.url} })
}


export default {
    getAllProduct,
    detailProduct,
    createProduct,
    insertProduct,
    editProduct,
    updateProduct,
    deleteProduct,
    viewProduct,
    viewDetailProduct
}