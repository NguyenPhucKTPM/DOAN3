// Lấy phần tử input số lượng
var quantityInput = document.getElementById('quantity');

// Lấy các nút "minus" và "plus"
var minusButton = document.querySelector('.quantity-left-minus');
var plusButton = document.querySelector('.quantity-right-plus');

// Xử lý sự kiện click trên nút "minus"
minusButton.addEventListener('click', function () {
  var currentValue = parseInt(quantityInput.value);
  if (currentValue > 1) {
    quantityInput.value = currentValue - 1;
  }
});

// Xử lý sự kiện click trên nút "plus"
plusButton.addEventListener('click', function () {
  var currentValue = parseInt(quantityInput.value);
  if (currentValue < 100) {
    quantityInput.value = currentValue + 1;
  }
});