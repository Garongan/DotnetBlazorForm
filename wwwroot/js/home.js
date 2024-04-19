$(document).ready(function () {
    let kd_negara = "";

    // auto complete country name
    $("#CountryName").autocomplete({
        minLength: 3,
        source: function (request, response) {
            $.ajax({
                url: "http://localhost:3000/negara?ur_negara=" + request.term,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    response(
                        data
                            .map((item) => {
                                const name = item.name.toLowerCase();
                                return (
                                    name.startsWith(request.term.toLowerCase()) && {
                                        label: name.toUpperCase(),
                                        kd_negara: item.kd_negara,
                                        value: name.toUpperCase(),
                                    }
                                );
                            })
                            .filter(Boolean)
                    );
                },
            });
        },
        select: function (event, ui) {
            kd_negara = ui.item.kd_negara;
        },
    });

    // auto complete harbour name
    $("#HarbourName").autocomplete({
        minLength: 3,
        source: function (request, response) {
            $.ajax({
                url: "http://localhost:3000/pelabuhan?kd_negara=" + kd_negara + "&ur_pelabuhan=" + request.term,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    response(
                        data
                            .map((item) => {
                                const ur_pelabuhan = item.ur_pelabuhan.toLowerCase();
                                return (
                                    ur_pelabuhan.startsWith(request.term.toLowerCase()) && {
                                        label: ur_pelabuhan.toUpperCase(),
                                        value: ur_pelabuhan.toUpperCase(),
                                    }
                                );
                            })
                            .filter(Boolean)
                    );
                },
            });
        },
    });
});
