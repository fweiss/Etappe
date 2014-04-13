var fixtures = function() {

    var p = new DOMParser();
    function p2(text) {
        return p.parseFromString(text, 'text/xml');

    }
    var p14076 = '<?xml version="1.0" encoding="utf-8" ?>\
        <body copyright="All data copyright San Francisco Muni 2014.">\
            <predictions agencyTitle="San Francisco Muni" routeTitle="33-Stanyan" routeTag="33" stopTitle="Clayton St &amp; Corbett Ave" stopTag="4076">\
                <direction title="Outbound to General Hospital">\
                    <prediction epochTime="1389502206228" seconds="301" minutes="5" isDeparture="false" dirTag="33__OB1" vehicle="5457" block="3302" tripTag="5825458" />\
                    <prediction epochTime="1389503315717" seconds="1410" minutes="23" isDeparture="false" affectedByLayover="true" dirTag="33__OB1" vehicle="5448" block="3304" tripTag="5825457" />\
                    <prediction epochTime="1389504515717" seconds="2610" minutes="43" isDeparture="false" affectedByLayover="true" dirTag="33__OB1" vehicle="5406" block="3305" tripTag="5825456" />\
                    <prediction epochTime="1389505715717" seconds="3810" minutes="63" isDeparture="false" affectedByLayover="true" dirTag="33__OB1" vehicle="5467" block="3301" tripTag="5825455" />\
                </direction>\
                <direction title="Outbound to Bryant &amp; 16th St.">\
                    <prediction epochTime="1389505965207" seconds="4060" minutes="67" isDeparture="false" affectedByLayover="true" dirTag="33__OB3" vehicle="5412" block="3303" tripTag="5825504" />\
                </direction>\
            </predictions>\
        </body>\
    ';
    var p13292 = '<?xml version="1.0" encoding="utf-8" ?>\
        <body copyright="All data copyright San Francisco Muni 2014.">\
            <predictions agencyTitle="San Francisco Muni" routeTitle="33-Stanyan" routeTag="33" stopTitle="16th St &amp; Mission St" stopTag="3292">\
                <direction title="Outbound to General Hospital">\
                    <prediction epochTime="1389502078339" seconds="173" minutes="2" isDeparture="false" dirTag="33__OB1" vehicle="5413" block="3306" tripTag="5825459" />\
                    <prediction epochTime="1389503045885" seconds="1140" minutes="19" isDeparture="false" dirTag="33__OB1" vehicle="5457" block="3302" tripTag="5825458" />\
                    <prediction epochTime="1389504155374" seconds="2250" minutes="37" isDeparture="false" affectedByLayover="true" dirTag="33__OB1" vehicle="5448" block="3304" tripTag="5825457" />\
                    <prediction epochTime="1389505355374" seconds="3450" minutes="57" isDeparture="false" affectedByLayover="true" dirTag="33__OB1" vehicle="5406" block="3305" tripTag="5825456" />\
                    <prediction epochTime="1389506555374" seconds="4650" minutes="77" isDeparture="false" affectedByLayover="true" dirTag="33__OB1" vehicle="5467" block="3301" tripTag="5825455" />\
                </direction>\
                <direction title="Outbound to Bryant &amp; 16th St.">\
                    <prediction epochTime="1389506730575" seconds="4825" minutes="80" isDeparture="false" affectedByLayover="true" dirTag="33__OB3" vehicle="5412" block="3303" tripTag="5825504" />\
                </direction>\
            </predictions>\
        </body>\
    ';
    var routeConfigXml2 = '<?xml version="1.0" encoding="utf-8"?>\
        <body copyright="copyright">\
            <route tag="33">\
                <stop tag="3296" title="16th St &amp; Potrero Ave" lat="37.7656999" lon="-122.40765" stopId="13296"/>\
                <stop tag="3295" title="16th St &amp; Potrero Ave" lat="37.7658599" lon="-122.40767" stopId="13295"/>\
                <direction></direction>\
                <path></path>\
            </route>\
            <route tag="37">\
                <stop tag="93295" title="16th St &amp; Potrero Ave" lat="37.7658599" lon="-122.40767" stopId="13295"/>\
                <direction></direction>\
                <path></path>\
            </route>\
        </body>';
    var routeConfigXml = '<?xml version="1.0" encoding="utf-8" ?>\
    <body copyright="All data copyright San Francisco Muni 2014.">\
    <route tag="33" title="33-Stanyan" color="660000" oppositeColor="ffffff" latMin="37.7514099" latMax="37.7869099" lonMin="-122.4592499" lonMax="-122.40627">\
        <stop tag="6293" title="Sacramento St &amp; Cherry St" lat="37.7869099" lon="-122.45656" stopId="16293"/>\
        <stop tag="3879" title="California St &amp; Maple St" lat="37.7862499" lon="-122.4552099" stopId="13879"/>\
        <stop tag="3852" title="California St &amp; Cherry St" lat="37.7860399" lon="-122.45683" stopId="13852"/>\
        <stop tag="3644" title="Arguello Blvd &amp; California St" lat="37.7855599" lon="-122.4592499" stopId="13644"/>\
        <stop tag="3645" title="Arguello Blvd &amp; Clement St" lat="37.78307" lon="-122.45907" stopId="13645"/>\
        <stop tag="3649" title="Arguello Blvd &amp; Geary Blvd" lat="37.7814299" lon="-122.4589499" stopId="13649"/>\
        <stop tag="3642" title="Arguello Blvd &amp; Balboa St" lat="37.7770799" lon="-122.4586399" stopId="13642"/>\
        <stop tag="4224" title="Fulton St &amp; Arguello Blvd" lat="37.7742799" lon="-122.458" stopId="14224"/>\
        <stop tag="6479" title="Stanyan St &amp; Fulton St" lat="37.7746" lon="-122.4547099" stopId="16479"/>\
        <stop tag="6481" title="Stanyan St &amp; Hayes St" lat="37.7727699" lon="-122.4543299" stopId="16481"/>\
        <stop tag="4963" title="Haight St &amp; Stanyan St" lat="37.7691699" lon="-122.45307" stopId="14963"/>\
        <stop tag="4949" title="Haight St &amp; Cole St" lat="37.7694399" lon="-122.45079" stopId="14949"/>\
        <stop tag="4947" title="Haight St &amp; Clayton St" lat="37.7697099" lon="-122.44866" stopId="14947"/>\
        <stop tag="3665" title="Ashbury St &amp; Waller St" lat="37.7691599" lon="-122.4468499" stopId="13665"/>\
        <stop tag="7295" title="Ashbury St &amp; Fredrick St" lat="37.7673099" lon="-122.4464699" stopId="17295"/>\
        <stop tag="3663" title="Ashbury St &amp; Piedmont St" lat="37.7652999" lon="-122.4460699" stopId="13663"/>\
        <stop tag="3657" title="Ashbury St &amp; Clifford Ter" lat="37.7642999" lon="-122.4460899" stopId="13657"/>\
        <stop tag="7220" title="Ashbury St &amp; Clayton St" lat="37.76301" lon="-122.4469699" stopId="17220"/>\
        <stop tag="4070" title="Clayton St &amp; Twin Peaks Blvd" lat="37.76086" lon="-122.4464799" stopId="14070"/>\
        <stop tag="4076" title="Clayton St &amp; Corbett Ave" lat="37.7586699" lon="-122.4458699" stopId="14076"/>\
        <stop tag="4080" title="Clayton St &amp; Market St" lat="37.75822" lon="-122.44432" stopId="14080"/>\
        <stop tag="5663" title="Market St &amp; Clayton St" lat="37.7584099" lon="-122.4440499" stopId="15663"/>\
        <stop tag="3328" title="18th St &amp; Danvers St" lat="37.76024" lon="-122.4434899" stopId="13328"/>\
        <stop tag="3336" title="18th St &amp; Hattie St" lat="37.7604899" lon="-122.44078" stopId="13336"/>\
        <stop tag="3329" title="18th St &amp; Diamond St" lat="37.7607" lon="-122.4372899" stopId="13329"/>\
        <stop tag="3326" title="18th St &amp; Castro St" lat="37.7608499" lon="-122.43484" stopId="13326"/>\
        <stop tag="3341" title="18th St &amp; Noe St" lat="37.7609599" lon="-122.4329" stopId="13341"/>\
        <stop tag="3345" title="18th St &amp; Sanchez St" lat="37.7610899" lon="-122.43068" stopId="13345"/>\
        <stop tag="3323" title="18th St &amp; Church St" lat="37.76125" lon="-122.4281399" stopId="13323"/>\
        <stop tag="3331" title="18th St &amp; Dolores St" lat="37.76139" lon="-122.4259299" stopId="13331"/>\
        <stop tag="3334" title="18th St &amp; Guerrero St" lat="37.7615199" lon="-122.42365" stopId="13334"/>\
        <stop tag="3349" title="18th St &amp; Valencia St" lat="37.7616599" lon="-122.42142" stopId="13349"/>\
        <stop tag="5553" title="Mission St &amp; 18th St" lat="37.7626399" lon="-122.41935" stopId="15553"/>\
        <stop tag="3292" title="16th St &amp; Mission St" lat="37.76502" lon="-122.41928" stopId="13292"/>\
        <stop tag="3299" title="16th St &amp; Shotwell St" lat="37.76522" lon="-122.4160499" stopId="13299"/>\
        <stop tag="3289" title="16th St &amp; Harrison St" lat="37.7653799" lon="-122.41329" stopId="13289"/>\
        <stop tag="3282" title="16th St &amp; Bryant St" lat="37.7655699" lon="-122.41033" stopId="13282"/>\
        <stop tag="3296" title="16th St &amp; Potrero Ave" lat="37.7656999" lon="-122.40765" stopId="13296"/>\
        <stop tag="6029" title="Potrero Ave &amp; 17th St" lat="37.7642299" lon="-122.40754" stopId="16029"/>\
        <stop tag="6031" title="Potrero Ave &amp; 18th St" lat="37.76164" lon="-122.40729" stopId="16031"/>\
        <stop tag="6033" title="Potrero Ave &amp; 20th St" lat="37.7590799" lon="-122.4070499" stopId="16033"/>\
        <stop tag="6034" title="Potrero Ave &amp; 21st St" lat="37.7574899" lon="-122.4068999" stopId="16034"/>\
        <stop tag="6036" title="Potrero Ave &amp; 22nd St" lat="37.7558799" lon="-122.4067499" stopId="16036"/>\
        <stop tag="6037" title="Potrero Ave &amp; 23rd St" lat="37.75399" lon="-122.40657" stopId="16037"/>\
        <stop tag="6039" title="Potrero Ave &amp; 24th St" lat="37.7526799" lon="-122.4064399" stopId="16039"/>\
        <stop tag="33511" title="25th St &amp; Potrero Ave" lat="37.7514099" lon="-122.40668" stopId="133511"/>\
        <stop tag="3288" title="16th St &amp; Harrison St" lat="37.7655199" lon="-122.41298" stopId="13288"/>\
        <stop tag="7289" title="16th St &amp; Folsom St" lat="37.7654" lon="-122.4154299" stopId="17289"/>\
        <stop tag="5552" title="Mission St &amp; 16th St" lat="37.76455" lon="-122.4197099" stopId="15552"/>\
        <stop tag="3338" title="18th St &amp; Mission St" lat="37.7618999" lon="-122.41951" stopId="13338"/>\
        <stop tag="3348" title="18th St &amp; Valencia St" lat="37.7617599" lon="-122.42173" stopId="13348"/>\
        <stop tag="3333" title="18th St &amp; Guerrero St" lat="37.76162" lon="-122.4239499" stopId="13333"/>\
        <stop tag="3330" title="18th St &amp; Dolores St" lat="37.76149" lon="-122.4262399" stopId="13330"/>\
        <stop tag="3322" title="18th St &amp; Church St" lat="37.76137" lon="-122.4281899" stopId="13322"/>\
        <stop tag="3344" title="18th St &amp; Sanchez St" lat="37.7612299" lon="-122.43046" stopId="13344"/>\
        <stop tag="3340" title="18th St &amp; Noe St" lat="37.7610899" lon="-122.43269" stopId="13340"/>\
        <stop tag="3325" title="18th St &amp; Castro St" lat="37.7609499" lon="-122.43515" stopId="13325"/>\
        <stop tag="3332" title="18th St &amp; Eureka St" lat="37.76077" lon="-122.4381499" stopId="13332"/>\
        <stop tag="3335" title="18th St &amp; Hattie St" lat="37.76059" lon="-122.4410899" stopId="13335"/>\
        <stop tag="3327" title="18th St &amp; Danvers St" lat="37.7603599" lon="-122.44354" stopId="13327"/>\
        <stop tag="3339" title="18th St &amp; Market St" lat="37.7597899" lon="-122.4444399" stopId="13339"/>\
        <stop tag="4079" title="Clayton St &amp; Market St" lat="37.7583799" lon="-122.4444799" stopId="14079"/>\
        <stop tag="4075" title="Clayton St &amp; Corbett Ave" lat="37.7587899" lon="-122.4459299" stopId="14075"/>\
        <stop tag="4077" title="Clayton St &amp; Carmel St" lat="37.76094" lon="-122.44634" stopId="14077"/>\
        <stop tag="3659" title="Ashbury St &amp; Clayton St" lat="37.7629799" lon="-122.4468" stopId="13659"/>\
        <stop tag="3656" title="Ashbury St &amp; Clifford Ter" lat="37.76428" lon="-122.4459499" stopId="13656"/>\
        <stop tag="3664" title="Ashbury St &amp; Piedmont St" lat="37.7651499" lon="-122.4458799" stopId="13664"/>\
        <stop tag="3661" title="Ashbury St &amp; Frederick St" lat="37.76715" lon="-122.44628" stopId="13661"/>\
        <stop tag="3666" title="Ashbury St &amp; Waller St" lat="37.7690099" lon="-122.4466599" stopId="13666"/>\
        <stop tag="3662" title="Ashbury St &amp; Haight St" lat="37.7699399" lon="-122.4468499" stopId="13662"/>\
        <stop tag="4946" title="Haight St &amp; Clayton St" lat="37.76989" lon="-122.4484699" stopId="14946"/>\
        <stop tag="4948" title="Haight St &amp; Cole St" lat="37.7695999" lon="-122.45078" stopId="14948"/>\
        <stop tag="4962" title="Haight St &amp; Stanyan St" lat="37.7693299" lon="-122.45284" stopId="14962"/>\
        <stop tag="6482" title="Stanyan St &amp; Oak St" lat="37.7708599" lon="-122.4537799" stopId="16482"/>\
        <stop tag="6480" title="Stanyan St &amp; Hayes St" lat="37.77282" lon="-122.45419" stopId="16480"/>\
        <stop tag="4236" title="Fulton St &amp; Stanyan St" lat="37.7747999" lon="-122.45484" stopId="14236"/>\
        <stop tag="3648" title="Arguello Blvd &amp; Fulton St" lat="37.7744299" lon="-122.4583" stopId="13648"/>\
        <stop tag="3651" title="Arguello Blvd &amp; Turk St" lat="37.77748" lon="-122.45852" stopId="13651"/>\
        <stop tag="3650" title="Arguello Blvd &amp; Geary Blvd" lat="37.7810799" lon="-122.4587599" stopId="13650"/>\
        <stop tag="3647" title="Arguello Blvd &amp; Euclid Ave" lat="37.7837399" lon="-122.4589599" stopId="13647"/>\
        <stop tag="3643" title="Arguello Blvd &amp; California St" lat="37.7855999" lon="-122.4590899" stopId="13643"/>\
        <stop tag="36293" title="Sacramento St &amp; Cherry St" lat="37.7869099" lon="-122.45656" stopId="136293"/>\
        <stop tag="3511" title="25th St &amp; Potrero Ave" lat="37.7514099" lon="-122.40668" stopId="13511"/>\
        <stop tag="4964" title="Hampshire St &amp; 24th St" lat="37.75283" lon="-122.40722" stopId="14964"/>\
        <stop tag="6038" title="Potrero Ave &amp; 24th St" lat="37.7532499" lon="-122.40627" stopId="16038"/>\
        <stop tag="6119" title="Sf General Hospital" lat="37.7554099" lon="-122.4064699" stopId="16119"/>\
        <stop tag="6035" title="Potrero Ave &amp; 22nd St" lat="37.7571899" lon="-122.4065999" stopId="16035"/>\
        <stop tag="6032" title="Potrero Ave &amp; 20th St" lat="37.7596199" lon="-122.4068399" stopId="16032"/>\
        <stop tag="6030" title="Potrero Ave &amp; 18th St" lat="37.76185" lon="-122.40705" stopId="16030"/>\
        <stop tag="6028" title="Potrero Ave &amp; 17th St" lat="37.7647399" lon="-122.40735" stopId="16028"/>\
        <stop tag="3295" title="16th St &amp; Potrero Ave" lat="37.7658599" lon="-122.40767" stopId="13295"/>\
        <stop tag="3281" title="16th St &amp; Bryant St" lat="37.7657199" lon="-122.40981" stopId="13281"/>\
        <direction tag="33__IB2" title="Inbound to the Richmond District" name="Inbound" useForUI="true">\
            <stop tag="3511" />\
            <stop tag="4964" />\
            <stop tag="6038" />\
            <stop tag="6119" />\
            <stop tag="6035" />\
            <stop tag="6032" />\
            <stop tag="6030" />\
            <stop tag="6028" />\
            <stop tag="3295" />\
            <stop tag="3281" />\
            <stop tag="3288" />\
            <stop tag="7289" />\
            <stop tag="5552" />\
            <stop tag="3338" />\
            <stop tag="3348" />\
            <stop tag="3333" />\
            <stop tag="3330" />\
            <stop tag="3322" />\
            <stop tag="3344" />\
            <stop tag="3340" />\
            <stop tag="3325" />\
            <stop tag="3332" />\
            <stop tag="3335" />\
            <stop tag="3327" />\
            <stop tag="3339" />\
            <stop tag="4079" />\
            <stop tag="4075" />\
            <stop tag="4077" />\
            <stop tag="3659" />\
            <stop tag="3656" />\
            <stop tag="3664" />\
            <stop tag="3661" />\
            <stop tag="3666" />\
            <stop tag="3662" />\
            <stop tag="4946" />\
            <stop tag="4948" />\
            <stop tag="4962" />\
            <stop tag="6482" />\
            <stop tag="6480" />\
            <stop tag="4236" />\
            <stop tag="3648" />\
            <stop tag="3651" />\
            <stop tag="3650" />\
            <stop tag="3647" />\
            <stop tag="3643" />\
            <stop tag="36293" />\
        </direction>\
        <direction tag="33__OB1" title="Outbound to General Hospital" name="Outbound" useForUI="true">\
            <stop tag="6293" />\
            <stop tag="3879" />\
            <stop tag="3852" />\
            <stop tag="3644" />\
            <stop tag="3645" />\
            <stop tag="3649" />\
            <stop tag="3642" />\
            <stop tag="4224" />\
            <stop tag="6479" />\
            <stop tag="6481" />\
            <stop tag="4963" />\
            <stop tag="4949" />\
            <stop tag="4947" />\
            <stop tag="3665" />\
            <stop tag="7295" />\
            <stop tag="3663" />\
            <stop tag="3657" />\
            <stop tag="7220" />\
            <stop tag="4070" />\
            <stop tag="4076" />\
            <stop tag="4080" />\
            <stop tag="5663" />\
            <stop tag="3328" />\
            <stop tag="3336" />\
            <stop tag="3329" />\
            <stop tag="3326" />\
            <stop tag="3341" />\
            <stop tag="3345" />\
            <stop tag="3323" />\
            <stop tag="3331" />\
            <stop tag="3334" />\
            <stop tag="3349" />\
            <stop tag="5553" />\
            <stop tag="3292" />\
            <stop tag="3299" />\
            <stop tag="3289" />\
            <stop tag="3282" />\
            <stop tag="3296" />\
            <stop tag="6029" />\
            <stop tag="6031" />\
            <stop tag="6033" />\
            <stop tag="6034" />\
            <stop tag="6036" />\
            <stop tag="6037" />\
            <stop tag="6039" />\
            <stop tag="33511" />\
        </direction>\
        <path>\
            <point lat="37.77428" lon="-122.458"/>\
            <point lat="37.77475" lon="-122.45468"/>\
            <point lat="37.7746" lon="-122.45471"/>\
            <point lat="37.77277" lon="-122.45433"/>\
            <point lat="37.76917" lon="-122.45353"/>\
            <point lat="37.76917" lon="-122.45307"/>\
        </path>\
        <path>\
            <point lat="37.76095" lon="-122.43515"/>\
            <point lat="37.76077" lon="-122.43815"/>\
            <point lat="37.76059" lon="-122.44109"/>\
            <point lat="37.76038" lon="-122.44338"/>\
            <point lat="37.76036" lon="-122.44354"/>\
            <point lat="37.7597499" lon="-122.44438"/>\
            <point lat="37.75979" lon="-122.44444"/>\
            <point lat="37.75972" lon="-122.44469"/>\
            <point lat="37.7595" lon="-122.44488"/>\
            <point lat="37.75924" lon="-122.44493"/>\
            <point lat="37.75894" lon="-122.44486"/>\
            <point lat="37.75869" lon="-122.44469"/>\
            <point lat="37.75852" lon="-122.44448"/>\
            <point lat="37.7582" lon="-122.44379"/>\
            <point lat="37.75838" lon="-122.44448"/>\
            <point lat="37.75833" lon="-122.44457"/>\
            <point lat="37.75833" lon="-122.44491"/>\
            <point lat="37.75874" lon="-122.44587"/>\
            <point lat="37.75879" lon="-122.44593"/>\
            <point lat="37.75876" lon="-122.44627"/>\
            <point lat="37.75905" lon="-122.44646"/>\
            <point lat="37.76042" lon="-122.44635"/>\
            <point lat="37.76091" lon="-122.4464"/>\
            <point lat="37.76094" lon="-122.44634"/>\
            <point lat="37.7614" lon="-122.44653"/>\
            <point lat="37.76178" lon="-122.44678"/>\
            <point lat="37.76273" lon="-122.447"/>\
            <point lat="37.76298" lon="-122.4468"/>\
            <point lat="37.76361" lon="-122.4466"/>\
            <point lat="37.76415" lon="-122.44611"/>\
            <point lat="37.76428" lon="-122.44595"/>\
            <point lat="37.76458" lon="-122.44584"/>\
            <point lat="37.76515" lon="-122.44588"/>\
            <point lat="37.76715" lon="-122.44628"/>\
            <point lat="37.76901" lon="-122.44666"/>\
            <point lat="37.76994" lon="-122.44685"/>\
            <point lat="37.77001" lon="-122.44694"/>\
            <point lat="37.7698899" lon="-122.44847"/>\
            <point lat="37.7695999" lon="-122.45078"/>\
            <point lat="37.7693299" lon="-122.45284"/>\
        </path>\
        <path>\
            <point lat="37.77443" lon="-122.4583"/>\
            <point lat="37.77748" lon="-122.45852"/>\
            <point lat="37.78108" lon="-122.45876"/>\
            <point lat="37.78374" lon="-122.45896"/>\
            <point lat="37.7856" lon="-122.45909"/>\
            <point lat="37.78661" lon="-122.45925"/>\
            <point lat="37.78691" lon="-122.45656"/>\
        </path>\
        <path>\
            <point lat="37.7655699" lon="-122.41033"/>\
            <point lat="37.7657" lon="-122.40765"/>\
            <point lat="37.76578" lon="-122.40754"/>\
            <point lat="37.76423" lon="-122.40754"/>\
        </path>\
        <path>\
            <point lat="37.76264" lon="-122.41935"/>\
            <point lat="37.76505" lon="-122.41968"/>\
            <point lat="37.76502" lon="-122.41928"/>\
            <point lat="37.76522" lon="-122.41605"/>\
            <point lat="37.76538" lon="-122.41329"/>\
            <point lat="37.7655699" lon="-122.41033"/>\
        </path>\
        <path>\
            <point lat="37.75141" lon="-122.40668"/>\
            <point lat="37.7513099" lon="-122.40714"/>\
            <point lat="37.75283" lon="-122.40722"/>\
            <point lat="37.75291" lon="-122.4073"/>\
            <point lat="37.75296" lon="-122.40652"/>\
            <point lat="37.75325" lon="-122.40627"/>\
            <point lat="37.75541" lon="-122.40647"/>\
            <point lat="37.75719" lon="-122.4066"/>\
            <point lat="37.75962" lon="-122.40684"/>\
            <point lat="37.76185" lon="-122.40705"/>\
            <point lat="37.76474" lon="-122.40735"/>\
        </path>\
        <path>\
            <point lat="37.7619" lon="-122.41951"/>\
            <point lat="37.76176" lon="-122.42173"/>\
            <point lat="37.76162" lon="-122.42395"/>\
            <point lat="37.76149" lon="-122.42624"/>\
            <point lat="37.76137" lon="-122.42819"/>\
            <point lat="37.76123" lon="-122.43046"/>\
            <point lat="37.76109" lon="-122.43269"/>\
            <point lat="37.76095" lon="-122.43515"/>\
        </path>\
        <path>\
            <point lat="37.76085" lon="-122.43484"/>\
            <point lat="37.76096" lon="-122.4329"/>\
            <point lat="37.76109" lon="-122.43068"/>\
            <point lat="37.7612499" lon="-122.42814"/>\
            <point lat="37.76139" lon="-122.42593"/>\
            <point lat="37.76152" lon="-122.42365"/>\
            <point lat="37.76166" lon="-122.42142"/>\
            <point lat="37.76184" lon="-122.41936"/>\
            <point lat="37.76264" lon="-122.41935"/>\
        </path>\
        <path>\
            <point lat="37.76572" lon="-122.40981"/>\
            <point lat="37.76552" lon="-122.41298"/>\
            <point lat="37.7654" lon="-122.41543"/>\
            <point lat="37.76505" lon="-122.41968"/>\
            <point lat="37.76455" lon="-122.41971"/>\
            <point lat="37.76184" lon="-122.41936"/>\
            <point lat="37.7619" lon="-122.41951"/>\
        </path>\
        <path>\
            <point lat="37.78691" lon="-122.45656"/>\
            <point lat="37.78713" lon="-122.45523"/>\
            <point lat="37.7862" lon="-122.45505"/>\
            <point lat="37.78625" lon="-122.45521"/>\
            <point lat="37.78604" lon="-122.45683"/>\
            <point lat="37.78568" lon="-122.45917"/>\
            <point lat="37.7855599" lon="-122.45925"/>\
            <point lat="37.78307" lon="-122.45907"/>\
            <point lat="37.78143" lon="-122.45895"/>\
            <point lat="37.77708" lon="-122.45864"/>\
            <point lat="37.7742999" lon="-122.45837"/>\
            <point lat="37.77428" lon="-122.458"/>\
        </path>\
        <path>\
            <point lat="37.76423" lon="-122.40754"/>\
            <point lat="37.76164" lon="-122.40729"/>\
            <point lat="37.75908" lon="-122.40705"/>\
            <point lat="37.75749" lon="-122.4069"/>\
            <point lat="37.75588" lon="-122.40675"/>\
            <point lat="37.75399" lon="-122.40657"/>\
            <point lat="37.75268" lon="-122.40644"/>\
            <point lat="37.75137" lon="-122.40619"/>\
            <point lat="37.75137" lon="-122.40657"/>\
            <point lat="37.75141" lon="-122.40668"/>\
        </path>\
        <path>\
            <point lat="37.76917" lon="-122.45307"/>\
            <point lat="37.76944" lon="-122.45079"/>\
            <point lat="37.76971" lon="-122.44866"/>\
            <point lat="37.77001" lon="-122.44694"/>\
            <point lat="37.76916" lon="-122.44685"/>\
            <point lat="37.76731" lon="-122.44647"/>\
            <point lat="37.7653" lon="-122.44607"/>\
            <point lat="37.76458" lon="-122.44584"/>\
            <point lat="37.7643" lon="-122.44609"/>\
            <point lat="37.76419" lon="-122.44608"/>\
            <point lat="37.76371" lon="-122.44651"/>\
            <point lat="37.76334" lon="-122.44675"/>\
            <point lat="37.76301" lon="-122.44697"/>\
            <point lat="37.76273" lon="-122.447"/>\
            <point lat="37.76185" lon="-122.44684"/>\
            <point lat="37.7614" lon="-122.44653"/>\
            <point lat="37.7611" lon="-122.44642"/>\
            <point lat="37.76086" lon="-122.44648"/>\
            <point lat="37.76042" lon="-122.44635"/>\
            <point lat="37.75905" lon="-122.44646"/>\
            <point lat="37.75876" lon="-122.44627"/>\
            <point lat="37.75874" lon="-122.44587"/>\
            <point lat="37.75867" lon="-122.44587"/>\
            <point lat="37.75833" lon="-122.44491"/>\
            <point lat="37.75833" lon="-122.44457"/>\
            <point lat="37.75822" lon="-122.44432"/>\
            <point lat="37.75827" lon="-122.44425"/>\
            <point lat="37.75815" lon="-122.444"/>\
            <point lat="37.75841" lon="-122.44405"/>\
            <point lat="37.75869" lon="-122.44469"/>\
            <point lat="37.75894" lon="-122.44486"/>\
            <point lat="37.75924" lon="-122.44493"/>\
            <point lat="37.7595" lon="-122.44488"/>\
            <point lat="37.75972" lon="-122.44469"/>\
            <point lat="37.7597499" lon="-122.44438"/>\
            <point lat="37.76024" lon="-122.44349"/>\
            <point lat="37.76038" lon="-122.44338"/>\
            <point lat="37.76049" lon="-122.44078"/>\
            <point lat="37.7607" lon="-122.43729"/>\
            <point lat="37.76085" lon="-122.43484"/>\
        </path>\
        <path>\
            <point lat="37.7693299" lon="-122.45284"/>\
            <point lat="37.76917" lon="-122.45353"/>\
            <point lat="37.77086" lon="-122.45378"/>\
            <point lat="37.77282" lon="-122.45419"/>\
            <point lat="37.77464" lon="-122.45463"/>\
            <point lat="37.7748" lon="-122.45484"/>\
            <point lat="37.7746799" lon="-122.45524"/>\
            <point lat="37.7742999" lon="-122.45837"/>\
            <point lat="37.77443" lon="-122.4583"/>\
        </path>\
        <path>\
            <point lat="37.76552" lon="-122.41298"/>\
            <point lat="37.7654" lon="-122.41543"/>\
            <point lat="37.76505" lon="-122.41968"/>\
            <point lat="37.76455" lon="-122.41971"/>\
            <point lat="37.76184" lon="-122.41936"/>\
            <point lat="37.7619" lon="-122.41951"/>\
        </path>\
        <path>\
            <point lat="37.76474" lon="-122.40735"/>\
            <point lat="37.76578" lon="-122.40754"/>\
            <point lat="37.76586" lon="-122.40767"/>\
            <point lat="37.76572" lon="-122.40981"/>\
        </path>\
    </route>\
    </body>\
';
    var p16239 = '<?xml version="1.0" encoding="utf-8" ?>\
        <body copyright="All data copyright San Francisco Muni 2014.">\
            <predictions agencyTitle="San Francisco Muni" routeTitle="37-Corbett" routeTag="37" stopTitle="Roosevelt Way &amp; Lower Ter" stopTag="6239">\
                <direction title="Outbound to Twin Peaks">\
                    <prediction epochTime="1390594967022" seconds="563" minutes="9" isDeparture="false" affectedByLayover="true" dirTag="37_OB1" vehicle="8526" block="3701" tripTag="5826422" />\
                    <prediction epochTime="1390596167022" seconds="1763" minutes="29" isDeparture="false" affectedByLayover="true" dirTag="37_OB1" vehicle="8518" block="3702" tripTag="5826421" />\
                    <prediction epochTime="1390597367022" seconds="2963" minutes="49" isDeparture="false" affectedByLayover="true" dirTag="37_OB1" vehicle="8515" block="3703" tripTag="5826420" />\
                    <prediction epochTime="1390599767022" seconds="5363" minutes="89" isDeparture="false" affectedByLayover="true" dirTag="37_OB1" vehicle="8526" block="3701" tripTag="5826418" />\
                </direction>\
                <message text="For real time srv alerts follow us on Twitter: sfmta_muni" priority="Low"/>\
                <message text="Sign-up for Route/Line specific Email/Text Alerts @ sfmta.com" priority="Low"/>\
            </predictions>\
        </body>';
    var p13255 = '<?xml version="1.0" encoding="utf-8" ?>\
        <body copyright="All data copyright San Francisco Muni 2014.">\
            <predictions agencyTitle="San Francisco Muni" routeTitle="37-Corbett" routeTag="37" stopTitle="14th St &amp; Church St" stopTag="3255">\
                <direction title="Outbound to Twin Peaks">\
                    <prediction epochTime="1390595302385" seconds="899" minutes="14" isDeparture="false" affectedByLayover="true" dirTag="37_OB1" vehicle="8526" block="3701" tripTag="5826422" />\
                    <prediction epochTime="1390596502385" seconds="2099" minutes="34" isDeparture="false" affectedByLayover="true" dirTag="37_OB1" vehicle="8518" block="3702" tripTag="5826421" />\
                    <prediction epochTime="1390597702385" seconds="3299" minutes="54" isDeparture="false" affectedByLayover="true" dirTag="37_OB1" vehicle="8515" block="3703" tripTag="5826420" />\
                </direction>\
                <message text="For real time srv alerts follow us on Twitter: sfmta_muni" priority="Low"/>\
                <message text="Sign-up for Route/Line specific Email/Text Alerts @ sfmta.com" priority="Low"/>\
            </predictions>\
        </body>';
    var p15726 = '<?xml version="1.0" encoding="utf-8" ?>\
        <body copyright="All data copyright San Francisco Muni 2014.">\
            <predictions agencyTitle="San Francisco Muni" routeTitle="M-Ocean View" routeTag="M" stopTitle="Church St Station Inbound" stopTag="5726">\
                <direction title="Inbound to Downtown">\
                    <prediction epochTime="1390595057062" seconds="653" minutes="10" isDeparture="false" dirTag="M__IB1" vehicle="1422" block="9612" tripTag="5848180" />\
                    <prediction epochTime="1390595463942" seconds="1060" minutes="17" isDeparture="false" dirTag="M__IB1" vehicle="1457" block="9603" tripTag="5848181" />\
                    <prediction epochTime="1390596212618" seconds="1809" minutes="30" isDeparture="false" dirTag="M__IB1" vehicle="1458" block="9608" tripTag="5848182" />\
                    <prediction epochTime="1390596394426" seconds="1991" minutes="33" isDeparture="false" dirTag="M__IB1" vehicle="1462" block="MUNSCHED" tripTag="MwkdUNSCHEDI" />\
                    <prediction epochTime="1390597122204" seconds="2718" minutes="45" isDeparture="false" affectedByLayover="true" dirTag="M__IB1" vehicle="1407" block="9609" tripTag="5848184" />\
                </direction>\
                <message text="For real time srv alerts follow us on Twitter: sfmta_muni" priority="Low"/>\
                <message text="Sign-up for Route/Line specific Email/Text Alerts @ sfmta.com" priority="Low"/>\
            </predictions>\
            <predictions agencyTitle="San Francisco Muni" routeTitle="L-Taraval" routeTag="L" stopTitle="Church St Station Inbound" stopTag="5726">\
                <direction title="Inbound to Downtown">\
                    <prediction epochTime="1390594824649" seconds="421" minutes="7" isDeparture="false" dirTag="L___IB1" vehicle="1403" vehiclesInConsist="2" block="9504" tripTag="5848071" />\
                    <prediction epochTime="1390595216342" seconds="813" minutes="13" isDeparture="false" dirTag="L___IB1" vehicle="1495" block="9509" tripTag="5848072" />\
                    <prediction epochTime="1390597194491" seconds="2791" minutes="46" isDeparture="false" affectedByLayover="true" dirTag="L___IB1" vehicle="1514" vehiclesInConsist="2" block="9510" tripTag="5848075" />\
                    <prediction epochTime="1390597794491" seconds="3391" minutes="56" isDeparture="false" affectedByLayover="true" dirTag="L___IB1" vehicle="1498" vehiclesInConsist="2" block="9501" tripTag="5848076" />\
                    <prediction epochTime="1390598394491" seconds="3991" minutes="66" isDeparture="false" affectedByLayover="true" dirTag="L___IB1" vehicle="1456" vehiclesInConsist="2" block="9511" tripTag="5848077" />\
                </direction>\
                <message text="For real time srv alerts follow us on Twitter: sfmta_muni" priority="Low"/>\
                <message text="Sign-up for Route/Line specific Email/Text Alerts @ sfmta.com" priority="Low"/>\
            </predictions>\
            <predictions agencyTitle="San Francisco Muni" routeTitle="KT-Ingleside/Third Street" routeTag="KT" stopTitle="Church St Station Inbound" stopTag="5726">\
                <direction title="Inbound to Visitacion Valley via Downtown">\
                    <prediction epochTime="1390594497001" seconds="93" minutes="1" isDeparture="false" dirTag="KT__IB1" vehicle="1443" block="9401" tripTag="5848284" />\
                    <prediction epochTime="1390594857913" seconds="454" minutes="7" isDeparture="false" dirTag="KT__IB1" vehicle="1537" block="9416" tripTag="5848285" />\
                    <prediction epochTime="1390595982292" seconds="1579" minutes="26" isDeparture="false" dirTag="KT__IB1" vehicle="1520" block="9412" tripTag="5848286" />\
                    <prediction epochTime="1390596188687" seconds="1785" minutes="29" isDeparture="false" affectedByLayover="true" dirTag="KT__IB1" vehicle="1496" block="9402" tripTag="5848287" />\
                    <prediction epochTime="1390596956415" seconds="2553" minutes="42" isDeparture="false" affectedByLayover="true" dirTag="KT__IB1" vehicle="1508" block="9414" tripTag="5848288" />\
                </direction>\
                <message text="For real time srv alerts follow us on Twitter: sfmta_muni" priority="Low"/>\
                <message text="Sign-up for Route/Line specific Email/Text Alerts @ sfmta.com" priority="Low"/>\
            </predictions>\
        </body>';
    var p16992 = '<?xml version="1.0" encoding="utf-8" ?>\
        <body copyright="All data copyright San Francisco Muni 2014.">\
            <predictions agencyTitle="San Francisco Muni" routeTitle="L-Taraval" routeTag="L" stopTitle="Embarcadero Station Arr" stopTag="6992">\
                <direction title="Inbound to Downtown">\
                    <prediction epochTime="1390594821911" seconds="418" minutes="6" isDeparture="false" dirTag="L___IB1" vehicle="1460" vehiclesInConsist="2" block="9505" tripTag="5848070" />\
                    <prediction epochTime="1390595383545" seconds="980" minutes="16" isDeparture="false" dirTag="L___IB1" vehicle="1403" vehiclesInConsist="2" block="9504" tripTag="5848071" />\
                    <prediction epochTime="1390595775238" seconds="1372" minutes="22" isDeparture="false" dirTag="L___IB1" vehicle="1495" block="9509" tripTag="5848072" />\
                    <prediction epochTime="1390597753387" seconds="3350" minutes="55" isDeparture="false" affectedByLayover="true" dirTag="L___IB1" vehicle="1514" vehiclesInConsist="2" block="9510" tripTag="5848075" />\
                    <prediction epochTime="1390598353387" seconds="3950" minutes="65" isDeparture="false" affectedByLayover="true" dirTag="L___IB1" vehicle="1498" vehiclesInConsist="2" block="9501" tripTag="5848076" />\
                </direction>\
                <message text="For real time srv alerts follow us on Twitter: sfmta_muni" priority="Low"/>\
                <message text="Sign-up for Route/Line specific Email/Text Alerts @ sfmta.com" priority="Low"/>\
            </predictions>\
            <predictions agencyTitle="San Francisco Muni" routeTitle="M-Ocean View" routeTag="M" stopTitle="Embarcadero Station Arr" stopTag="6992">\
                <direction title="Inbound to Downtown">\
                    <prediction epochTime="1390594839167" seconds="435" minutes="7" isDeparture="false" dirTag="M__IB1" vehicle="1536" vehiclesInConsist="2" block="9601" tripTag="5848179" />\
                    <prediction epochTime="1390595612868" seconds="1209" minutes="20" isDeparture="false" dirTag="M__IB1" vehicle="1422" block="9612" tripTag="5848180" />\
                    <prediction epochTime="1390596019748" seconds="1616" minutes="26" isDeparture="false" dirTag="M__IB1" vehicle="1457" block="9603" tripTag="5848181" />\
                    <prediction epochTime="1390596768424" seconds="2365" minutes="39" isDeparture="false" dirTag="M__IB1" vehicle="1458" block="9608" tripTag="5848182" />\
                    <prediction epochTime="1390596950232" seconds="2547" minutes="42" isDeparture="false" dirTag="M__IB1" vehicle="1462" block="MUNSCHED" tripTag="MwkdUNSCHEDI" />\
                </direction>\
                <message text="For real time srv alerts follow us on Twitter: sfmta_muni" priority="Low"/>\
                <message text="Sign-up for Route/Line specific Email/Text Alerts @ sfmta.com" priority="Low"/>\
            </predictions>\
            <predictions agencyTitle="San Francisco Muni" routeTitle="N-Judah" routeTag="N" stopTitle="Embarcadero Station Arr" stopTag="6992">\
                <direction title="Inbound to Caltrain via Downtown">\
                    <prediction epochTime="1390594831894" seconds="428" minutes="7" isDeparture="false" delayed="true" slowness="0.299" dirTag="N__IB1" vehicle="1525" vehiclesInConsist="2" block="9702" tripTag="5840380" />\
                    <prediction epochTime="1390595019300" seconds="616" minutes="10" isDeparture="false" dirTag="N__IB1" vehicle="1414" block="9703" tripTag="5840381" />\
                    <prediction epochTime="1390595635887" seconds="1232" minutes="20" isDeparture="false" dirTag="N__IB1" vehicle="1465" block="9715" tripTag="5840382" />\
                    <prediction epochTime="1390596376043" seconds="1972" minutes="32" isDeparture="false" dirTag="N__IB1" vehicle="1449" vehiclesInConsist="2" block="9704" tripTag="5840383" />\
                    <prediction epochTime="1390596902333" seconds="2499" minutes="41" isDeparture="false" affectedByLayover="true" dirTag="N__IB1" vehicle="1523" vehiclesInConsist="2" block="9705" tripTag="5840384" />\
                </direction>\
                <message text="For real time srv alerts follow us on Twitter: sfmta_muni" priority="Low"/>\
                <message text="Sign-up for Route/Line specific Email/Text Alerts @ sfmta.com" priority="Low"/>\
            </predictions>\
            <predictions agencyTitle="San Francisco Muni" routeTitle="KT-Ingleside/Third Street" routeTag="KT" stopTitle="Embarcadero Station Arr" stopTag="6992">\
                <direction title="Inbound to Visitacion Valley via Downtown">\
                    <prediction epochTime="1390595048217" seconds="644" minutes="10" isDeparture="false" dirTag="KT__IB1" vehicle="1443" block="9401" tripTag="5848284" />\
                    <prediction epochTime="1390595409129" seconds="1005" minutes="16" isDeparture="false" dirTag="KT__IB1" vehicle="1537" block="9416" tripTag="5848285" />\
                    <prediction epochTime="1390596533508" seconds="2130" minutes="35" isDeparture="false" dirTag="KT__IB1" vehicle="1520" block="9412" tripTag="5848286" />\
                    <prediction epochTime="1390596739903" seconds="2336" minutes="38" isDeparture="false" affectedByLayover="true" dirTag="KT__IB1" vehicle="1483" block="9402" tripTag="5848287" />\
                    <prediction epochTime="1390597507631" seconds="3104" minutes="51" isDeparture="false" affectedByLayover="true" dirTag="KT__IB1" vehicle="1508" block="9414" tripTag="5848288" />\
                </direction>\
                <message text="For real time srv alerts follow us on Twitter: sfmta_muni" priority="Low"/>\
                <message text="Sign-up for Route/Line specific Email/Text Alerts @ sfmta.com" priority="Low"/>\
            </predictions>\
            <predictions agencyTitle="San Francisco Muni" routeTitle="J-Church" routeTag="J" stopTitle="Embarcadero Station Arr" stopTag="6992">\
                <direction title="Inbound to Downtown">\
                    <prediction epochTime="1390594843592" seconds="440" minutes="7" isDeparture="false" dirTag="J__IB1" vehicle="1475" block="9309" tripTag="5840496" />\
                    <prediction epochTime="1390595115190" seconds="711" minutes="11" isDeparture="false" dirTag="J__IB1" vehicle="1466" block="9301" tripTag="5840497" />\
                    <prediction epochTime="1390595827747" seconds="1424" minutes="23" isDeparture="false" dirTag="J__IB1" vehicle="1501" block="9306" tripTag="5840498" />\
                    <prediction epochTime="1390596220589" seconds="1817" minutes="30" isDeparture="false" dirTag="J__IB1" vehicle="1467" block="9302" tripTag="5840499" />\
                    <prediction epochTime="1390596466036" seconds="2062" minutes="34" isDeparture="false" dirTag="J__IB1" vehicle="1419" block="9306" tripTag="5840498" />\
                </direction>\
                <message text="For real time srv alerts follow us on Twitter: sfmta_muni" priority="Low"/>\
                <message text="Sign-up for Route/Line specific Email/Text Alerts @ sfmta.com" priority="Low"/>\
            </predictions>\
        </body>';

    return {
        p14076: p2(p14076),
        p13292: p2(p13292),

        // 37 & KLM outbound
        p16239: p2(p16239),
        p13255: p2(p13255),
        p15726: p2(p15726),
        p16992: p2(p16992),

        routeConfig: p2(routeConfigXml),
        routeConfig2: p2(routeConfigXml2)
    };
}();
