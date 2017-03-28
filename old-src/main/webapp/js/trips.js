var trips = function() {
    return [
        {
            id: 1,
            routes: {
                outbound: [
                    { carrier: "sfmuni", route: "33", origin: "14076", destination: "13292" },
                    { carrier: "bart", route: "1", origin: "16TH", destination: "MONT" }
                ],
                inbound: [
                    { carrier: "bart", route: "1", origin: "MONT", destination: "16TH" },
                    { carrier: "sfmuni", route: "33", origin: "15552", destination: "14075" }
                ]
            }
        },
        {
            id: 2,
            routes: {
                outbound: [
                    { carrier: "sfmuni", route: "37", origin: "16239", destination: "13255" },
                    { carrier: "sfmuni", route: "1", origin: "15726", destination: "16992" }
                ],
                inbound: [
                    { carrier: "sfmuni", route: "L", origin: "17217", destination: "16998" },
                    { carrier: "sfmuni", route: "37", origin: "13254", destination: "16238" }
                ]
            }
        }
    ];
}();