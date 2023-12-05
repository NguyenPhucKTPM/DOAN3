import express from "express";
import slideModel from "../services/slideModel";
import productModel from "../services/productModel";

const getHomePage = async (req, res) => {

    let listSlide = await slideModel.getAllSlide();
    let listProductBestsell = await productModel.bannerProductBanChay();
    let listProductOutStanding = await productModel.bannerProductNoiBat();
    let listProductSale = await productModel.bannerProductKhuyenMai();
    return res.render('index',
        {
            data:
            {
                title: 'Trang chủ',
                page: 'home',
                listSlide,
                listProductBestsell,
                listProductOutStanding,
                listProductSale,
                getUrl: req.url
            }
        });
}

export default {
    getHomePage,
} 