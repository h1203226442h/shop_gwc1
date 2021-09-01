$(function(){
    sum();
    msg();
    $.ajax({
        url:"data.json",
        success:function(arr){
            for(var i = 0;i < arr.length;i++){
                var node = $(`
                <li class="l">
                    <div claas="goods_img">
                        <img src="${arr[i].img}" alt="">
                    </div>
                    <div class="goods_title">
                        <p>番剧</p>
                    </div>
                    <div class="goods_btn" id="${arr[i].id}">加入购物车</div>
                </li>
                `);
                node.appendTo(".goods_k ul");
            }
        },
        error:function(msg){
            console.log(msg);
        }
    })

    $(".gwc_r").on("mouseenter",function(){
        $(this).stop(true).animate({
            right:0
        },500);
    })

    $(".gwc_r").on("mouseleave",function(){
        $(this).stop(true).animate({
            right:-300
        },500);
    })

    $(".goods_k ul").on("click",".goods_btn",function(){
        ballMove(this);
        var id = this.id;
        var first = $.cookie("goods") == undefined ? true : false;
        if(first){
            $.cookie("goods",JSON.stringify([{id:id,num:1}]),{
                expires:7
            })
        }else{
            var same = false;
            var Str = $.cookie("goods");
            var Arr = JSON.parse(Str);
            console.log(Arr);
            for(var i = 0;i < Arr.length;i++){
                if(id == Arr[i].id){
                    same = true;
                    Arr[i].num++;
                    break;
                }
            }
            if(!same){
                Arr.push({id:id,num:1});
            }
            $.cookie("goods",JSON.stringify(Arr),{
                expires:7
            })
        }
        sum();
        msg();
        console.log($.cookie("goods"));
    })

    $(".remove_c").on("click",function(){
        $.cookie("goods",null,{
            expires:-1
        }) 
        sum();
        msg();
    })

    function sum(){
        var str = $.cookie("goods");
        if(!str){
            $(".gwc_r .gwc_n").html(0);
        }else{
            var arr = JSON.parse(str);
            var sum = 0;
            for(var i =0;i < arr.length;i++){
                sum += arr[i].num;
            }
            $(".gwc_r .gwc_n").html(sum);
        }
    }
    function msg(){
        $(".gwc_r ul").empty();
        $.ajax({
            url:"data.json",
            success:function(arr){
                var Str = $.cookie("goods");
                if(Str){
                    var Arr = JSON.parse(Str);
                    var newarr = [];
                    for(var i = 0;i < arr.length;i++){
                        for(var j = 0;j < Arr.length;j++){
                            if(arr[i].id == Arr[j].id){
                                arr[i].num = Arr[j].num;
                                newarr.push(arr[i]);
                            }
                        }
                    }
                    for(var z = 0;z < newarr.length;z++){
                        var node = $(`
                        <li id="${newarr[z].id}" class="l">
                            <div class="gwcl_img l">
                                <img src="${newarr[z].img}" alt="">
                            </div>
                            <div class="gwcl_btn l">购买</div>
                            <div class="gwcl_delbtn l">删除</div>
                            <button>-</button>
                            <div class="gwcl_msg">商品数量：${newarr[z].num}</div>
                            <button>+</button>
                        </li>
                        `)
                        node.appendTo(".gwc_r ul");
                    }
                }
            },
            error:function(msg){
                alert(msg);
            }
        })
    }
    $(".gwc_r ul").on("click",".gwcl_delbtn",function(){
        var id = $(this).closest("li").remove().attr("id");
        var str = $.cookie("goods");
        var arr = JSON.parse(str);
        for(var i = 0; i < arr.length;i++){
            if(arr[i].id == id){
                arr.splice(i,1);
                break;
            }
        }
        if(!arr.length){
            $.cookie("goods",null,{
                expires:-1
            })
        }else{
            $.cookie("goods",JSON.stringify(arr),{
                expires:7
            })
        }
        sum();
    })
    $(".gwc_r ul").on("click","button",function(){
        var id = $(this).closest("li").attr("id"); 
        var str = $.cookie("goods");
        var arr = JSON.parse(str);
        for(var i = 0; i < arr.length;i++){
            if(id == arr[i].id){
                if(this.innerHTML == "+"){
                    arr[i].num++;
                    $(this).prevAll(".gwcl_msg").html("商品数量：" + arr[i].num); //不用重新刷新页面
                }else{
                    if(arr[i].num == 1){
                        alert("最低数量为1,请删除");
                    }else{
                        arr[i].num--;
                        $(this).nextAll(".gwcl_msg").html("商品数量：" + arr[i].num);
                    }
                }
                $.cookie("goods",JSON.stringify(arr),{
                    expires:7
                })
                break;
            }
        }
        sum();
    })
    function ballMove(obtn){
        var x = $(obtn).offset().left + 90;
        var y = $(obtn).offset().top;
        $("#ball").css({
            display:"block",
            left:x,
            top:y
        })
        var xx =$(".gwc_r .gwc_s").offset().left - $("#ball").offset().left;
        var yy =$(".gwc_r .gwc_s").offset().top - $("#ball").offset().top;
        var p = new Parabola({
            el:"#ball",
            offset:[xx,yy],
            duration:600,
            curvature:0.0004,
            callback:function(){
                $("#ball").hide();
            }
        })
        p.start();
    }
})