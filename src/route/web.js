import express from "express";
import getHomePage from "../controllers/homeController";
import aboutPage from "../controllers/aboutController";
import userController from "../controllers/userController";
import categoryController from "../controllers/categoryController";
import productController from "../controllers/productController";
import { isLogin, allowedRoles } from "../middleware/auth";
import uploadCloud from "../middleware/upload";
import { name } from "ejs";

const router = express.Router();

const initWebRoute = (app) =>{



    router.get('/',getHomePage);

    router.get('/about', isLogin,aboutPage);

    router.get('/admin',userController.admin);
    
   
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


    router.use((req, res, next) => {
        res.status(404).render('404');
    });

    return app.use('/',router);
}
export default initWebRoute