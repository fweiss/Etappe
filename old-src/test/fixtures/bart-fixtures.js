bart_fixtures = {
    stations: "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\
        <root>\
        <uri><![CDATA[ http://api.bart.gov/api/stn.aspx?cmd=stns ]]></uri>\
        <stations>\
        <station>\
            <name>12th St. Oakland City Center</name>\
            <abbr>12TH</abbr>\
            <gtfs_latitude>37.803664</gtfs_latitude>\
            <gtfs_longitude>-122.271604</gtfs_longitude>\
            <address>1245 Broadway</address>\
            <city>Oakland</city>\
            <county>alameda</county>\
            <state>CA</state>\
            <zipcode>94612</zipcode>\
        </station>\
        <station>\
            <name>West Oakland</name>\
            <abbr>WOAK</abbr>\
            <gtfs_latitude>37.80467476</gtfs_latitude>\
            <gtfs_longitude>-122.2945822</gtfs_longitude>\
            <address>1451 7th Street</address>\
            <city>Oakland</city>\
            <county>alameda</county>\
            <state>CA</state>\
            <zipcode>94607</zipcode>\
        </station>\
    </stations>\
    <message />\
    </root>",

    routes: "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\
    <root>\
    <uri> http://api.bart.gov/api/route.aspx?cmd=routeinfo&route=6 </uri>\
    <sched_num>26</sched_num>\
    <routes>\
        <route>\
        <name>Fremont - Daly City</name>\
<abbr>FRMT-DALY</abbr>\
    <routeID>ROUTE 5</routeID>\
<number>5</number>\
    <origin>FRMT</origin>\
<destination>DALY</destination>\
    <direction></direction>\
    <color>#339933</color>\
    <holidays>0</holidays>\
    <num_stns>19</num_stns>\
    <config>\
        <station>FRMT</station>\
        <station>UCTY</station>\
        <station>SHAY</station>\
        <station>HAYW</station>\
        <station>BAYF</station>\
        <station>SANL</station>\
        <station>COLS</station>\
        <station>FTVL</station>\
        <station>LAKE</station>\
        <station>WOAK</station>\
        <station>EMBR</station>\
        <station>MONT</station>\
        <station>POWL</station>\
        <station>CIVC</station>\
        <station>16TH</station>\
        <station>24TH</station>\
        <station>GLEN</station>\
        <station>BALB</station>\
        <station>DALY</station>\
    </config>\
</route>\
    <route>\
        <name>Daly City - Fremont</name>\
        <abbr>DALY-FRMT</abbr>\
        <routeID>ROUTE 6</routeID>\
        <number>6</number>\
        <origin>DALY</origin>\
        <destination>FRMT</destination>\
        <direction>south</direction>\
        <color>#339933</color>\
        <holidays>0</holidays>\
        <num_stns>19</num_stns>\
        <config>\
            <station>DALY</station>\
            <station>BALB</station>\
            <station>GLEN</station>\
            <station>24TH</station>\
            <station>16TH</station>\
            <station>CIVC</station>\
            <station>POWL</station>\
            <station>MONT</station>\
            <station>EMBR</station>\
            <station>WOAK</station>\
            <station>LAKE</station>\
            <station>FTVL</station>\
            <station>COLS</station>\
            <station>SANL</station>\
            <station>BAYF</station>\
            <station>HAYW</station>\
            <station>SHAY</station>\
            <station>UCTY</station>\
            <station>FRMT</station>\
        </config>\
    </route>\
</routes>\
    <message />\
</root>"
};
