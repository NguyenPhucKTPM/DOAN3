import express from "express";
import slideModel from "../services/slideModel";

const getHomePage = async (req, res) => {

    let listSlide = await slideModel.getAllSlide()
    return res.render('index',
        {
            data:
            {
                title: 'Trang chủ',
                page: 'home',
                listSlide,
                getUrl: req.url
            }
        });
}

export default {
    getHomePage,
} 