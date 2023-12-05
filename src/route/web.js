import express from "express";

import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import categoryController from "../controllers/categoryController";
import productController from "../controllers/productController";
import slideController from "../controllers/slideController";
import cartController from "../controllers/cartController";
import checkoutController from "../controllers/checkoutController";
import orderController from "../controllers/orderController";
import dasboardController from "../controllers/dasboardController";

import { isLogin, allowedRoles } from "../middleware/auth";
import uploadCloud from "../middleware/upload";

const router = express.Router();

const initWebRoute = (app) =>{



    router.get('/',homeController.getHomePage);


    router.get('/admin',dasboardController.getDasboardPage);
    
   
    // userController

    router.get('/login',userController.login);
    router.post("/login-user", userController.loginUser);

    router.get('/register',userController.register);
    router.post('/signup',userController.signup)

    router.get("/logout", userController.logout);

    router.get('/detail-user',isLogin,allowedRoles(["user"]),userController.detailInfoUser);

    router.get('/change-info',isLogin,allowedRoles(["user"]),userController.editInfoUser);
    router.post('/update-info-user',isLogin,allowedRoles(["user"]),userController.updateInfoUser);

    router.get('/change-pass',isLogin,userController.editPass);
    router.post('/update-pass',isLogin,userController.updatePass);


    // -Admin
    router.get('/change-pass-admin',isLogin,allowedRoles(["admin"]),userController.editPassAdmin);

    router.get('/view-detail-user/:userName',isLogin,allowedRoles(["admin"]),userController.viewDetailUser);
    router.get('/list-user',isLogin,allowedRoles(["admin"]),userController.listUser);

    router.get("/create-new-user",isLogin,allowedRoles(["admin"]),userController.newUser);
    router.post('/insert-user',isLogin,allowedRoles(["admin"]),userController.insertUser);

    router.get('/edit-user/:userName',isLogin,allowedRoles(["admin"]),userController.editUser);
    router.post('/update-user',isLogin,allowedRoles(["admin"]),userController.updateUser);
    router.post('/delete-user',isLogin,allowedRoles(["admin"]),userController.deleteUser);


    //categoryController
    router.get('/list-category',isLogin,allowedRoles(["admin"]),categoryController.getAllCategory);

    router.get('/create-new-category',isLogin,allowedRoles(["admin"]),categoryController.createCategory);
    router.post('/insert-category',isLogin,allowedRoles(["admin"]),categoryController.insertCategory);

    router.get('/delete-category/:idDanhMuc',isLogin,allowedRoles(["admin"]),categoryController.deleteCategory);
    router.get('/detail-category/:idDanhMuc',isLogin,allowedRoles(["admin"]),categoryController.detailCategory);

    router.get('/edit-category/:idDanhMuc',isLogin,allowedRoles(["admin"]),categoryController.editCategory);
    router.post('/update-category',isLogin,allowedRoles(["admin"]),categoryController.updateCategory);

    //productController
    //admin
    router.get('/list-product',isLogin,allowedRoles(["admin"]),productController.getAllProduct);

    router.get('/delete-product/:idSanPham',isLogin,allowedRoles(["admin"]),productController.deleteProduct);
    router.get('/detail-product/:idSanPham',isLogin,allowedRoles(["admin"]),productController.detailProduct);

    router.get('/create-new-product',isLogin,allowedRoles(["admin"]),productController.createProduct);
    router.post('/insert-product',
    isLogin,allowedRoles(["admin"]),
    uploadCloud.fields
    ([
        { name: 'hinhAnh', maxCount: 1 },
        { name: 'hinhAnhPhu', maxCount: 10 }
    ]),
    productController.insertProduct);

    router.get('/edit-product/:idSanPham',isLogin,allowedRoles(["admin"]),productController.editProduct);
    router.post('/update-product',
    isLogin,allowedRoles(["admin"]),
    uploadCloud.fields
    ([
        { name: 'hinhAnh', maxCount: 1 },
        { name: 'hinhAnhPhu', maxCount: 10 }
    ]),
    productController.updateProduct);

    router.get('/delete-image-product/:idHinhAnhPhu/:idSanPham',isLogin,allowedRoles(["admin"]),productController.deleteImagesProduct);

    //user
    router.get('/phone/:tenDanhMuc/:idDanhMuc',productController.viewProduct);
    router.get('/detail-phone/:idSanPham',productController.viewDetailProduct);

    //slideController
    //admin
    router.get('/list-slide',isLogin,allowedRoles(["admin"]),slideController.getAllSlide);

    router.get('/create-new-slide',isLogin,allowedRoles(["admin"]),slideController.createSlide);
    router.post('/insert-slide',isLogin,allowedRoles(["admin"]),uploadCloud.single('hinhSlide'),slideController.insertSlide);

    router.get('/delete-slide/:idSlide',isLogin,allowedRoles(["admin"]),slideController.deleteSlide);

    router.get('/edit-slide/:idSlide',isLogin,allowedRoles(["admin"]),slideController.editSlide);
    router.post('/update-slide',isLogin,allowedRoles(["admin"]),uploadCloud.single('hinhSlide'),slideController.updateSlide);


    //cartControler
    router.get('/add-cart/:idSanPham',cartController.store);
    router.get('/cart',cartController.cart);
    router.get('/clear',cartController.clearAll);
    router.get('/clear-product/:idSanPham',cartController.clearProduct);
    router.post('/update-cart',cartController.update);



    //checkoutController
    router.get('/checkout',checkoutController.formCheckout);
    router.post('/insert-order',checkoutController.insertOrder);
    router.get('/thank',checkoutController.thank)

    // orderController
    router.get('/list-order-paid',isLogin,allowedRoles(['admin']),orderController.getOrderPaid);
    router.get('/list-order-wait',isLogin,allowedRoles(['admin']),orderController.getOrderWait);
    router.get('/list-order-cancel',isLogin,allowedRoles(['admin']),orderController.getOrderCancel);
    router.get('/list-order-confirmed',isLogin,allowedRoles(['admin']),orderController.getOrderConfirmed);
    router.get('/confirm-order/:trangThai/:idDonhang',isLogin,allowedRoles(['admin']),orderController.confirmOrder);
    router.get('/detail-order/:idDonHang',isLogin,allowedRoles(['admin']),orderController.getDetailOrder);

    router.use((req, res, next) => {
        res.status(404).render('404');
    });

    return app.use('/',router);
}
export default initWebRoute