$(document).ready(function () {
    const baseUrl = "https://insw-dev.ilcs.co.id/n";
    let kd_negara = "";
    let hs_code = "";
    const toCurrency = (price) => {
        return price
            .toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
            })
            .replace(/Rp|,00/g, "")
            .trim();
    };

    // auto complete country name
    $("#CountryName").autocomplete({
        minLength: 3,
        source: function (request, response) {
            $.ajax({
                url: baseUrl + "/negara?ur_negara=" + request.term,
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
        select: function (event, data) {
            kd_negara = data.item.kd_negara;
        },
    });

    // auto complete harbour name
    $("#HarbourName").autocomplete({
        minLength: 3,
        source: function (request, response) {
            $.ajax({
                url: baseUrl + "/pelabuhan?kd_negara=" + kd_negara + "&ur_pelabuhan=" + request.term,
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

    // auto complete details stuff from code code
    $("#StuffCode").on("change", function () {
        hs_code = $(this).val();
        $.ajax({
            url: baseUrl + "/barang?hs_code=" + hs_code,
            method: "GET",
            dataType: "json",
            success: function (data) {
                if (data) {
                    $("#StuffDetails").val(data[0].details);
                }
            },
        });
    });

    // auto complete stuff price
    $("#StuffPrice").on("change", function () {
        const price = toCurrency($(this).val().replace(/\D/g, ""));
        $.ajax({
            url: baseUrl + "/tarif?hs_code=" + hs_code,
            method: "GET",
            dataType: "json",
            success: function (data) {
                if (data) {
                    const dutyPrice = data.rate_bea_masuk;
                    $("#StuffDuty").val(dutyPrice);
                    $("#StuffDutyTotal").val(toCurrency(price * (dutyPrice / 100)));
                }
            },
        });
    });
});
