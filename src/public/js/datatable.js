    $(document).ready(function () {
        $('#table_id').DataTable({
            language: {
                processing: "Message khi đang tải dữ liệu",
                search: "Tìm kiếm : ",
                lengthMenu: "Điều chỉnh số lượng bản ghi trên 1 trang _MENU_ ",
                info: "Bản ghi từ _START_ đến _END_ Tổng công _TOTAL_ bản ghi",
                infoEmpty: "Khi không có dữ liệu, Hiển thị 0 bản ghi trong 0 tổng cộng 0 ",
                infoFiltered: "(Message bổ sung cho info khi không search đc record nào _MAX_)",
                // infoPostFix: "Alo Alo", // Cái này khi thêm vào nó sẽ đứng sau info
                loadingRecords: "",
                zeroRecords: "Không có kết quả nào phù hợp",
                emptyTable: "Không có dữ liệu",
                paginate: {
                    first: "Trang đầu",
                    previous: "Trang trước",
                    next: "Trang sau",
                    last: "Trang cuối"
                },
                aria: {
                    sortAscending: ": Message khi đang sắp xếp theo column",
                    sortDescending: ": Message khi đang sắp xếp theo column",
                }
            },
            // "scrollX": true
        });
        $('#table_detail').DataTable({
            searching: false, // Tắt nút tìm kiếm
            paging: false, // Tắt phân trang
            info: false,
            language: {
                // info: "Bản ghi từ _START_ đến _END_ Tổng công _TOTAL_ bản ghi",
            },
            // Các tùy chọn khác cho DataTable mới ở đây
        });
       
      
    });
