function formatPrice(inputElement){
    if(inputElement.value !== ''){
        const values = inputElement.value.replaceAll('.','');
        let price = parseInt(values);
        let priceFormat = price.toLocaleString('vi');
        inputElement.value = priceFormat;
    }
}
