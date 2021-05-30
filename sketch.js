//Create variables here
var dog, dogI, happyDogI ;
var database, foodS, foodStock;
var fedTime, lastFed;
var foodObj;
var Feed, addFood;
var changeGS, readGS;
var bedroomi, gardeni, washroomi;
var gameState;

function preload()
{
  //load images here
  dogI = loadImage("dogImg.png");
  happyDogI = loadImage("dogImg1.png");

  bedroomi=loadImage("bedroom.png");
  gardeni=loadImage("Garden.png");
  washroomi=loadImage("washroom.png");
}

function setup() {
	createCanvas(1000, 600);
  database = firebase.database();

  foodObj=new Food();

  dog = createSprite(800,200,50,50);
  dog.addImage(dogI);
  dog.scale = 0.2;
  
  foodStock = database.ref("food");
  foodStock.on("value", readStock);

  //read gamestate
  readGS=database.ref('gameState');
  readGS.on("value",function(data){
    gameState=data.val();
  });

  feed=createButton("Feed The Dog");
  feed.position(750,120);
  feed.mousePressed(feedDog);

  addFood=createButton("add food");
  addFood.position(900,120);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87);
  //foodObj.display();

  drawSprites();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

   if(gameState!="hungry"){
     feed.hide();
     addFood.hide();
     //dog.remove();
   }else{
     feed.show();
     addFood.show();
     dog.addImage(dogI);
   }

   currentTime=hour();
   if(currentTime==(lastFed+1)){
     updateS("playing");
     foodObj.garden();
   }else if(currentTime==(lastFed+2)){
     updateS("sleeping");
     foodObj.bedroom();
   }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
    updateS("bathing");
    foodObj.washroom();
   }else{
     updateS("hungry");
     foodObj.display();
   }
}

function updateS(sate){
  database.ref('/').update({
    gameState:sate
  });
}

function readStock(data){
    foodS=data.val();
    foodObj.updateFoodStock(foodS);
  }

function feedDog(){
  dog.addImage(happyDogI);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;

  database.ref('/').update({
    food:foodS
  })
}

/*function writeStock(x){

  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }*/
  
  /*database.ref('/').update({
    food:x
  })*/

