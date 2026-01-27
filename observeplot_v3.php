<!doctype html>
<html lang="en">

    <head>
        <style>
            .flex_container {
    display: flex;
    flex-wrap: nowrap;
}
        .bootstrap-tagsinput .tag {
            color: black !important;
        }
        .bootstrap-tagsinput {
            width: 100%;
        }
        .plot_image_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 154px;
}
.badge.badge-danger {
    background: tomato;
    color: white ! IMPORTANT;
}
.badge.badge-success {
    background: green;
    color: white !important;
}
.badge.badge-warning {
    background: gray;
    color: white ! IMPORTANT;
}
form.plot_image_form {
    margin-left: 13px;
}
form.plot_image_form .btn {
    margin-top: 16px;
}
.log_data_accept,.log_data_reject {
    display:none;
}
    </style>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/bootstrap.tagsinput/0.4.2/bootstrap-tagsinput.css" />
         <?php $this->load->view('admin/common/meta'); ?>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js"></script>


        <style>
   /* table tr td {
        padding: 4px;
        border: 1px solid black;
        width: 100%;
        font-size: 16px;
    }
    table {
        width: 100% !important;
    }*/
    .pdetails tr td:nth-child(odd) {
    font-weight: bold;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.season_sidebar {
    text-align: center;
    margin-top: 6px;
}
.categories ul li a,.season ul li a {
    text-decoration: none;
    color: black;
    display: block;
    margin: 7px 0px;
    font-size: 14px;
}

.season {
    display: inline-block;
}

li.done {
    background: green;
}

li.pending {
    background: grey;
}

li.done a {
    color: white !important;
}

.categories ul li,.season ul li {
    display: inline-block;
    padding: 5px 20px;
    margin-bottom: 7px;
    box-shadow: 1px 2px 2px 2px #d0d7dd;
}
.categories ul {
/*    margin-left: -76px;*/
}

.categories {
    text-align: center;
margin-top: 22px;
}
.categories ul li.active,.season ul li.active {
    background: #ff8f00;
}
 page .card {
    display:none;
}
 page .card.active {
    display: block;
}

page .Mcard {
    display:none;
}
page .Mcard.active {
    display: block;
    margin: 10px;
}

page .season_container {
    display:none;
}
 page .season_container.active {
    display: block;
}
td {
    max-width: auto;
}
li.spacer {
    box-shadow: none !important;
    border: none;
}
.log_action {
    /* display:none; */
}
</style>
    </head>

    
    <body>

    <!-- <body data-layout="horizontal" data-topbar="colored"> -->

        <!-- Begin page -->
        <div id="layout-wrapper mt-5">
                    <?php

                     $pd = $excel_form;
                    
                   function startsWith($string, $startString) {
              return strncmp($string, $startString, strlen($startString)) === 0;
            }

            function status_return($status,$remark=''){

                $message = '';
                $badge_class = '';
                $reject_contact = '';

                switch ($status) {
                    case 0:
                        $message = 'Pending';
                        $badge_class = 'text-dark badge badge-warning';
                        break;
                    case 1:
                        $message = 'Accepted';
                        $badge_class = 'text-dark badge badge-success';
                        break;
                    case 2:
                        $message = 'Rejected';
                        $badge_class = 'text-dark badge badge-danger';
                        $reject_contact = "<p>".$remark."</p>";
                        break;
                    default:
                        $message = 'Unknown';
                        $badge_class = 'text-dark badge badge-secondary';
                        break;
                } 
                return "<p>Status: <span class='".$badge_class."'>".$message."</span></p>".$reject_contact;
                
            }
                    function table_creator($content) {
                        $table = '';
                        if (empty($content)) {
                            $table .= "<h2 style='text-align:center;'>Activity Pending</h2>";
                        } else {
                            if (!startsWith($content, "[")) {
                                $content = "[" . $content . "]";
                            }    
                            $content1 = json_decode($content, true);
                            
                            if (is_array($content1)) {
                                foreach ($content1 as $c) {
                                    $table .= "<table class='table table-bordered pdetails'>";
                                    $table .= "<tbody>";    
                                    $key = array_keys($c);
                                    $val = array_values($c);
                                    $table .= "<tr>";
                                    
                                    foreach ($val as $k => $v) {
                                        // Format key: replace "_" with " " and capitalize
                                        $formattedKey = ucwords(str_replace('_', ' ', $key[$k]));
                                        
                                        $table .= "<td>" . $formattedKey . "</td>";
                                        $table .= "<td>" . $val[$k] . "</td>";

                                        if ((($k + 1) % 2 == 0)) {
                                            $table .= "</tr><tr>";
                                        }
                                    }
                                    $table .= "</tr>";
                                    $table .= "</tbody></table><br>";
                                }
                            }
                        }
                        return $table;
                    }

                    function input_creator($content,$action=''){
                        $table = '<form class="log_form" action="'.$action.'" method="post">';
                        if(empty($content)){
                            $table .= "<h2 style='text-align:center;'>Activity Pending<h2>";
                        }else {
                        if(!startsWith($content,"[")){
                          $content = "[".$content."]";
                        }    
                        $content1 = json_decode($content,true);
                        // print_r($content1);exit;
                        foreach($content1 as $c){
                            // print_r($c);exit;
                         $table .= "<table class='table table-bordered pdetails'>";
                         $table .= "<tbody>";    
                         $key = array_keys($c);
                         $val = array_values($c);
                         $table .= "<tr>";
                         foreach($val as $k=>$v){
                           
                            // if($k%2==0){
                             $table .= "<td>".$key[$k]."</td>";
                            // }else {
                             if(!is_bool(strpos($key[$k],"date"))){
                                $fdate = empty($key[$k])?'':date("Y-m-d",strtotime($val[$k]));
                                $table .= "<td><input type='date' name='".$key[$k]."' value='".$fdate."' /></td>";
                             }else {
                             $table .= "<td><input type='text' name='".$key[$k]."' value='".$val[$k]."' /></td>";
                             }
                                
                            // }
                             if((($k+1)%2==0)){
                                $table .= "</tr><tr>";
                            }
                            // if((($k+1)%4==0)){
                            //     $table .= "<tr>";
                            // }
                         }
                         $table .= "</tr>";
                         $table .= "</tbody></table><br>";
                        }
                        }
                        $table .="<button type='submit' class='btn btn-success'>Submit</button>";
                        $table.="</form>";
                        return $table;
                    }
                     ?> 
<page>
   
        <div class="season_sidebar">
            <div class="season">
                <ul>
                    <?php
                    $previous_season_id = null; // Variable to track the previous season_id

                    foreach ($season as $k => $ld2) {
                    
                    
                        $isActive = ($ld2->id == $season_id) ? 'active' : '';
                        $isClickable = in_array($ld2->id, $season_id_array);
                        $linkClass = $isClickable ? 'BigLink3' : 'BigLink3 disabled-link';
                        $linkStyle = $isClickable ? '' : 'style="pointer-events: none; color: gray;"'; ?>
                        <li class="<?= $isActive ?>">
                            <a class="<?= $linkClass ?>"
                            href="<?= $isClickable ? base_url("SuperAdmin/SeasonalData/PlotObservation/" . $activity_id . "/0/" . $ld2->id) : '#' ?>"
                            s="<?= $k ?>" <?= $linkStyle ?>>
                                <?= htmlspecialchars($ld2->name) ?>
                            </a>
                        </li>

                        <?php
                    
                    }
                    ?>
                </ul>

                <ul>
                    <?php
                    $previous_season_id = null; // Variable to track the previous season_id

                    foreach ($log_details as $k => $ld1) {
                    
                        ?>
                        <li class="<?= ($ld1->id == $area_id) ? 'active' : ''; ?>">
                            <a class="BigLink3" 
                            href="<?= base_url("SuperAdmin/SeasonalData/PlotObservation/" . $activity_id . "/" . $ld1->id).'/'.$season_id ?>" 
                            s="<?= $k ?>">
                                <?= htmlspecialchars($ld1->area_name) ?>
                            </a>
                        </li>
                        <?php
                        // Update the previous season_id to the current one
                        $previous_season_id = $ld1->season_id;
                    }
                    ?>
                </ul>

            </div>
        </div>

    <?php 
      $k=0;
     ?>
    <div class="season_container <?= ($k==0)?'active':''; ?>" id="<?= $k ?>">    
        <div class="categories">
            <ul>
               
                <?php if(!empty($this->session->userdata('admin_id_mulivendor'))){ ?>
                <li class="active" class="<?= ($active_area->log_data_status)?'done':'pending'; ?>"><a class="Link" s="<?= $k ?>_1">Seasonal Activities</a></li>
            
            <?php } ?>
             <li ><a class="Link " s="<?= $k ?>_2">Plot Details</a></li>
            
            </ul>
        </div>
        
        <div class="card " id="<?= $k ?>_2">

            <div class="card-header">Plot Details</div>
                <div class="card-body">
                    <?php foreach($plots as $pd){ ?>
                    <table class="table table-bordered pdetails">
                        <tr>
                        <td>Created Date</td><td><?= $pd->setdate ?></td>
                        <td >Plot Image</td><td >
                            <div class="plot_image_box">
                            <img class="lozad" id="target_image" data-src="<?= $pd->plot_images ?>" width="50px" />
                        <form class="plot_image_form" method="post" action="<?= base_url("SuperAdmin/SeasonalData/update_plot_image/").$active_area->area_id ?>" enctype="multipart/form-data">    
                        <input type="file" name="plot_images" id="plot_image" />
                        <button class="btn btn-success">Update Plot Image</button>
                        </form>
                        </div>
                        </td>
                        
                        <td >Land Area</td><td ><?= $fd->land_area_in_acerage ?> Acre</td>
                        </tr>
                        <tr><td>Plot Number</td><td><?= $fd->farmer_code."".$pd->unique_plot_number_dikhane_ke_liye ?></td>
                        <td>Survey number</td><td><?= $fd->survey_number ?></td>
                        <td>Govt Id Num</td><td><?= $pd->unique_govt_id ?></td>
                    </tr>
                    <tr>
                        <td>Pattadar Passbook Number</td><td><?= $pd->pattadar_book_number ?></td>
                        <td>PlotOwnership</td><td><?= $pd->plotOwnership ?></td>
                        <td>Plot Pincode</td><td><?= $pd->plot_pincode ?></td>
                    </tr>
                    <tr>
                        <td>Plot Village</td><td><?= $pd->plot_village ?></td>
                        <td>Plot Mandal</td><td><?= $pd->plot_mandal ?></td>
                        <td>Plot District</td><td><?= $pd->plot_district ?></td>
                    </tr>
                    <tr>
                        <td>Plot State</td><td><?= $pd->plot_state ?></td>
                        <td>Plot Address</td><td><?= $pd->plot_address ?></td>
                        <td>Plot Landmark</td><td><?= $pd->plot_land_mark ?></td>
                    </tr>
                        <tr>
                        
                        <td>Latitude</td><td><?= $pd->latitude ?></td>
                        <td>Longitude</td><td><?= $pd->longitude ?></td>
                        <td >Area</td><td colspan="2"><?= round($pd->plot_area,3) ?> Acre</td>
                    </tr>
                    
                    
                    <tr>
                        <td >Plot Location</td><td colspan="5"><?= $pd->plot_location ?></td>
                    </tr>
                    </table>
                <?php } ?>
            </div>
        </div>

        <div class="Mcard active" id="<?= $k ?>_1">
            <div class="row">
                <div class="card2 col-md-6" id="<?= $k ?>_11">
                    <?php $this->load->view('admin/main/seasonal_data/edit_activities/log_details',  $passdata); ?>
                 </div>
                 <div class="card2 col-md-6" id="<?= $k ?>_7">
                  <?php $this->load->view('admin/main/seasonal_data/edit_activities/organic_amendments');
                  $this->load->view('admin/main/seasonal_data/edit_activities/pipe_installation_details');
                   ?>
               
                     </div>        
                <div class="card2 col-md-6" id="<?= $k ?>_9">
                     <?php $this->load->view('admin/main/seasonal_data/edit_activities/fertilizer_details');?>
                </div>
                <div class="card2 col-md-6" id="<?= $k ?>_5">
                   <?php $this->load->view('admin/main/seasonal_data/edit_activities/weed_management');?>
                </div>
                <div class="card2 col-md-6" id="<?= $k ?>_6">
                  <?php $this->load->view('admin/main/seasonal_data/edit_activities/pest_disease');?> 
                </div> 
                <div class="card2 col-md-6" id="<?= $k ?>_2">
                    <?php $this->load->view('admin/main/seasonal_data/edit_activities/harvesting_details');?> 
                </div>
                <div class="card2 col-md-6" id="<?= $k ?>_15">
                   <?php $this->load->view('admin/main/seasonal_data/edit_activities/water_regime_during_cultivation');?> 
                </div>
                <div class="card2 col-md-6" id="<?= $k ?>_16">
                    <div class="card-header">Field Visit Events </div>
                    
                        <div class="card-body">
                           <?php  
                            if(!empty($draw_pipe_event)) {
                                $counter = 1;
                            ?>
                                <table class="table table-bordered pdetails">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Image</th>
                                            <th>Date</th>
                                            <th>Type</th>
                                            <th>Location</th>
                                            <th>Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach($draw_pipe_event as $dpe): ?>
                                            <tr>
                                                <td><b><?= $counter ?></b></td>
                                                <td>
                                                    <?php if(!empty($dpe->pipe_installation_drw_image)): ?>
                                                        <img class="lozad" data-src="<?= htmlspecialchars($dpe->pipe_installation_drw_image) ?>" width="60px">
                                                    <?php else: ?>
                                                        No Image
                                                    <?php endif; ?>
                                                </td>
                                                <td><?= htmlspecialchars($dpe->pipe_installation_drw_date ?? '') ?></td>
                                                <td><?= htmlspecialchars($dpe->pipe_installation_drw_type ?? '') ?></td>
                                                <td>
                                                    <?php 
                                                    if(!empty($dpe->pipe_drw_latitude) && !empty($dpe->pipe_drw_longitude)):
                                                        $pipe_drw_latitude = str_replace("lat :- ","",$dpe->pipe_drw_latitude);
                                                        $pipe_drw_longitude = str_replace("long :- ","",$dpe->pipe_drw_longitude);
                                                        $lat_long = $pipe_drw_latitude."<br>".$pipe_drw_longitude;
                                                        $lat_long_re = $pipe_drw_latitude.",".$pipe_drw_longitude;
                                                    ?>
                                                        <a target="_blank" href="https://www.google.com/maps/place/<?= urlencode($lat_long_re) ?>">
                                                            <?= $lat_long ?>
                                                        </a>
                                                    <?php else: ?>
                                                        Not Available
                                                    <?php endif; ?>
                                                </td>
                                                <td><?= htmlspecialchars($dpe->pipe_installation_drw_reason ?? '') ?></td>
                                            </tr>
                                            <?php $counter++; ?>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            <?php } ?>
                        </div>
                        
                </div>          
            </div>
        </div>
    </div>

</page>
            </div>
        </div>
        <?php $this->load->view('admin/common/footer_script'); ?>
        <?php $this->load->view('admin/common/main_footer_script'); ?>
    </div>
<div class="modal fade" id="rejectionModal" tabindex="-1" role="dialog" aria-labelledby="rejectionModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="rejectionModalLabel">Reject Harvesting Details</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="rejectionForm">
          <input type="hidden" name="type" value="">
          <input type="hidden" name="id" value="">
          <div class="form-group">
            <label for="rejectionRemark">Reason for Rejection</label>
            <textarea class="form-control" id="rejectionRemark" name="remark" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>


<div class="modal fade" id="rejectionModal2" tabindex="-1" role="dialog" aria-labelledby="rejectionModalLabel2" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="rejectionModalLabel2">Reject Harvesting Details</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="rejectionForm2">
          <input type="hidden" name="type" value="">
          <input type="hidden" name="id" value="">
          <div class="form-group">
            <label for="rejectionRemark">Reason for Rejection</label>
            <textarea class="form-control" id="rejectionRemark" name="remark" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

</body>
         </html>                                 


    <script>
let bermudaTriangle;
// let map;
let trash = [];
// function initMap() {
//   const myLatLng = { lat: <?= str_replace("lat :- ","",$pd->latitude) ?>, lng: <?= str_replace("long :- ","",$pd->longitude) ?> };
//    const priceTag = document.createElement("div");

//   priceTag.className = "price-tag";
//   priceTag.textContent = "$2.5M";
//   const map1 = new google.maps.Map(document.getElementById("map1"), {
//     zoom: 20,
//     center: myLatLng,
//     mapTypeId: "hybrid",
//   });

//   //  new google.maps.Marker({
//   //   position: myLatLng,
//   //   map1,
//   //   content: priceTag,

//   // });
//    const image =
//     "https://corecarbonsrp.com/assets/pin4.png";
//   const beachMarker = new google.maps.Marker({
//     position: myLatLng,
//     map1,
//     icon: image,
//   });
//   beachMarker.setMap(map1);
// }


let map;
let maxZoomService;

function showMaxZoom(e) {
  maxZoomService.getMaxZoomAtLatLng(e.latLng, (result) => {
    if (result.status !== "OK") {
      infoWindow.setContent("Error in MaxZoomService");
    } else {
      infoWindow.setContent(
        "The maximum zoom at this location is: " + result.zoom
      );
    }

    infoWindow.setPosition(e.latLng);
    infoWindow.open(map);
  });
}

function initMap1(dd) {
   const myLatLng = { lat: <?= str_replace("lat :- ","",$pd->latitude) ?>, lng: <?= str_replace("long :- ","",$pd->longitude) ?> };
   const priceTag = document.createElement("div");   
   map = new google.maps.Map(document.getElementById("map2"), {
    zoom: 20,
    center: myLatLng,
    mapTypeId: "hybrid",
  });
  maxZoomService = new google.maps.MaxZoomService();
  map.addListener("click", showMaxZoom);

  const flightPlanCoordinates = dd;
   bermudaTriangle = new google.maps.Polygon({
    paths: flightPlanCoordinates,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    editable:true
  });

  bermudaTriangle.setMap(map);
 map.addListener("click", addLatLng);
 const image =
    "https://corecarbonsrp.com/assets/pin4.png";
  const beachMarker = new google.maps.Marker({
    position: myLatLng,
    map,
    icon: image,

  });
  // flightPath.setMap(map);


  // priceTag.className = "price-tag";
  // priceTag.textContent = "$2.5M";
  // const map1 = new google.maps.Map(document.getElementById("map1"), {
  //   zoom: 20,
  //   center: myLatLng,
  //   mapTypeId: "hybrid",
  // });

  //  new google.maps.Marker({
  //   position: myLatLng,
  //   map1,
  //   content: priceTag,

  // });
   
}
function addLatLng(event) {
  const path = bermudaTriangle.getPath();
  // const image =
  //   "https://corecarbonsrp.com/assets/pin4.png";
  // Because path is an MVCArray, we can simply append a new coordinate
  // and it will automatically appear.
  path.push(event.latLng);
  // Add a new marker at the new plotted point on the polyline.
  new google.maps.Marker({
    position: event.latLng,
    title: "#" + path.getLength(),
    icon: image,
    map: map,

  });
}



function removeLatestOne(event) {
  const path = bermudaTriangle.getPath();

  // Because path is an MVCArray, we can simply append a new coordinate
  // and it will automatically appear.
  // console.log(path);
  // if(path[path.length-1] != null){
  // console.log('hhh',path);
  // path.pop();
  trash.push(path.pop());
  console.log(trash);
  // }
  // Add a new marker at the new plotted point on the polyline.
  new google.maps.Marker({
    position: event.latLng,
    title: "#" + path.getLength(),
    map: map,
  });
}

$(document).on("click", ".log_toggle", function () {
    var seasonId = $(this).attr("season");
    var type = $(this).attr("type");

    // Toggle visibility of view and edit sections based on seasonId and type
    $("."+type+"_view_" + seasonId).toggleClass("d-none");
    $("."+type+"_edit_" + seasonId).toggleClass("d-none");
});

$(document).on("click",".update_plot_polyline",function(){
    var href = $(this).attr("href");
    var polypath = [];
    let path = bermudaTriangle.getPath();
    let contentString ='[';
    for (let i = 0; i < path.getLength(); i++) {
    const xy = path.getAt(i);
    if(i==0){
    contentString +=
      "lat/lng: ("+ xy.lat() + "," + xy.lng()+")";
      polypath[i] = xy.lat()+","+xy.lng();;
  }else {
      contentString += ", lat/lng: ("+ xy.lat() + "," + xy.lng()+")";
      polypath[i] = xy.lat()+","+xy.lng();;
  }
  }
  contentString += ']';
   var areaLeft = google.maps.geometry.spherical.computeArea(path);
   plot_area = (areaLeft)/4046.85642
  // console.log(areaLeft);return false;
    $.post(href,{path:contentString,plot_area:plot_area},function(data){
        alert("Coodinates Updated Succesfully");
    })
})

function addLatestOne(event) {
  const path = bermudaTriangle.getPath();

  // Because path is an MVCArray, we can simply append a new coordinate
  // and it will automatically appear.
  // console.log(path);
  if(trash[trash.length-1] != null){
  // trash.pop();
  path.push(trash.pop());
  }
  // Add a new marker at the new plotted point on the polyline.
  new google.maps.Marker({
    position: event.latLng,
    title: "#" + path.getLength(),
    map: map,
  });
}

const observer = lozad();
observer.observe();

document.addEventListener('keydown', function(event){
  if(event.keyCode == 90 && event.ctrlKey){
   removeLatestOne();
  }
}, false);

document.addEventListener('keydown', function(event){
  if(event.keyCode == 89 && event.ctrlKey){
   addLatestOne();
  }
}, false);

            $(document).on("click",".categories ul li",function(){
            var s = $(this).find("a").attr("s");
            $(".categories ul li").removeClass("active");
            $(this).addClass("active");
            $(".card").removeClass("active");
            $('#'+s).addClass("active");
            if(s==13){
               initMap(); 
            }
            if(s=='0_14'){
                var url = $("#poligon_url").attr("url");
                var dd = '';
                const d = $.get(url,function(data){
                dd = JSON.parse(data);
                console.log(dd);

                initMap1(dd); 
                }) 
            }
          })   


          //    $(document).on("click",".season ul li",function(){
          //   var s = $(this).find("a").attr("s");
          //   $(".season ul li").removeClass("active");
          //   $(this).addClass("active");
          //   $(".season_container").removeClass("active");
          //   $('#'+s).addClass("active");
          // })   

 $(document).on("submit",".log_form",function(event){
    event.preventDefault();
    var formData = new FormData(this);
    var action = $(this).attr("action");
    $.ajax({
                    url: action, 
                    type: "POST",    
                    data: formData, 
                    cache : false,
                    processData: false,
                    contentType: false,
                    success: function (html) {
                    }
            });
 })         

 $(document).on("submit",".plot_image_form",function(event){
    event.preventDefault();
    var formData = new FormData(this);
    var action = $(this).attr("action");
    $(".plot_image_form").find("button").attr('disabled','disabled');
    $(".plot_image_form").find("button").html('Image Uploading....');
    $.ajax({
                    url: action, 
                    type: "POST",    
                    data: formData, 
                    cache : false,
                    processData: false,
                    contentType: false,
                    success: function (html) {
                        var htm = JSON.parse(html);
                        if(htm.status==true){
                            $("#target_image").attr('src',htm.url);
                            alert(htm.message);
                        }else {
                            alert(htm.message);
                        }
                        $(".plot_image_form").find("button").attr('disabled',false);
                            $(".plot_image_form").find("button").html('Update Plot Image');
                            $(".plot_image_form").trigger('reset');
                    }
            });
 })    
  $(".toggle_organic").click(function() {
    if($(".organic").css("display")=='none'){
            $(".organic").css("display","block");
        }else {
            $(".organic").css("display","none");
        }      

        if($(".edit_organic").css("display")=='none'){
            $(".edit_organic").css("display","block");
        }else {
            $(".edit_organic").css("display","none");
        }      
 
})

   $('.log_data_accept').click(function() {
        var type = $(this).attr('type');
        var id = $(this).attr('id');
        
        // Perform AJAX request
        $.ajax({
            url: "<?= base_url("SuperAdmin/Seasonal/ActivityAction/reject_log_activity") ?>",
            type: 'POST',
            data: {
                type: type,
                id: id,
                action: 'accept'
            },
            success: function(response) {
                // Handle success response
                console.log(response);
                // You can do something here if needed
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error(error);
            }
        });
    });

 $(document).on("click",".edit_log_data",function(){
    var type1 = $(this).attr("type1");
    var type2 = $(this).attr("type2");
    if($("."+type1).hasClass("d-none")){
        
        $("."+type1).removeClass("d-none");
        $("."+type2).addClass("d-none");
    }
    else{
        
        $("."+type2).removeClass("d-none");
        $("."+type1).addClass("d-none");
    }
 })

   $('.organic_data_accept').click(function() {
        var type = $(this).attr('type');
        var id = $(this).attr('id');
        
        // Perform AJAX request
        $.ajax({
            url: "<?= base_url("SuperAdmin/SeasonalData/organic_amendment_action") ?>",
            type: 'POST',
            data: {
                type: type,
                id: id,
                action: 'accept'
            },
            success: function(response) {
                // Handle success response
                console.log(response);
                // You can do something here if needed
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error(error);
            }
        });
    });

    // Reject button click event
    $('.log_data_reject').click(function() {
        var type = $(this).attr('type');
        var id = $(this).attr('id');
        var rtitle = $(this).data('rtitle');
        $("#rejectionModalLabel").html(rtitle);
        $('#rejectionModal').find('input[name="type"]').val(type);
        $('#rejectionModal').find('input[name="id"]').val(id);
        $('#rejectionModal').modal('show');
    });

    // Reject button click event
    $('.organic_data_reject').click(function() {
        var type = $(this).attr('type');
        var id = $(this).attr('id');
        var rtitle = $(this).data('rtitle');
        $("#rejectionModalLabel2").html(rtitle);
        $('#rejectionModal2').find('input[name="type"]').val(type);
        $('#rejectionModal2').find('input[name="id"]').val(id);
        $('#rejectionModal2').modal('show');
    });

    // Handle submission of rejection form
    $('#rejectionForm').submit(function(event) {
        event.preventDefault();

        // Perform AJAX request
        $.ajax({
            url: "<?= base_url("SuperAdmin/Seasonal/ActivityAction/reject_log_activity") ?>",
            type: 'POST',
            data: $(this).serialize() + '&action=reject',
            success: function(response) {
                // Handle success response
                console.log(response);
                // You can do something here if needed
                // Close the modal
                $('#rejectionModal').modal('hide');
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error(error);
            }
        });
    });


     $('#rejectionForm2').submit(function(event) {
        event.preventDefault();

        // Perform AJAX request
        $.ajax({
            url: "<?= base_url("SuperAdmin/SeasonalData/organic_amendment_action") ?>",
            type: 'POST',
            data: $(this).serialize() + '&action=reject',
            success: function(response) {
                // Handle success response
                console.log(response);
                // You can do something here if needed
                // Close the modal
                $('#rejectionModal').modal('hide');
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error(error);
            }
        });
    });

</script>
   
    