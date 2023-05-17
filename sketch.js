var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running,trex_death;
var ground, groundpng,invisground;
var cloud,cloudpng,groupC;
var obstacle, o, o1, o2, o3, o4, o5,groupO;
var score;
var go, gO;
var r, Rr;
var j,ch,d;

function preload(){
trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
groundpng = loadImage("ground2.png");
cloudpng = loadImage("cloud.png");
trex_death = loadAnimation("trex_collided.png");
o = loadImage("obstacle1.png");
o1 = loadImage("obstacle2.png");
o2 = loadImage("obstacle3.png");
o3 = loadImage("obstacle4.png");
o4 = loadImage("obstacle5.png");
o5 = loadImage("obstacle6.png");
gO = loadImage("gameOver.png");
Rr = loadImage("restart.png");
j = loadSound("jump.mp3");
ch = loadSound("checkpoint.mp3");
d = loadSound("die.mp3");
}

function setup(){

  createCanvas(windowWidth,windowHeight);
trex = createSprite(50,height-120,50,70);
trex.addAnimation("running",trex_running);
trex.addAnimation("collided",trex_death);
trex.scale = 0.7;
trex.debug = true;
trex.setCollider("rectangle",0,0,300,trex.height);
trex.setCollider("circle",0,0,35);

ground = createSprite(width/2,height-130,width,2);
ground.addImage("ground", groundpng);
ground.x = ground.width/2;

go = createSprite(width/2,height/2-100);
go.addImage(gO);
r = createSprite(width/2, height/2);
r.addImage(Rr);

invisground = createSprite(200,height-100,400,10);
invisground.visible = false;

groupO = createGroup();
groupC = createGroup();

score = 0;
}

function draw(){

  background("white");
   
  text("score "+score, width-150, 100);

   if (gameState === PLAY){
      if(touches.length > 0 || keyDown("space") && trex.y >= height-150){
        j.play();
        trex.velocity.y = -15;
        touches = [];
      }

      score = score + Math.round(getFrameRate()/60);
      if(score > 0 && score % 500 === 0){
        ch.play();
      }

      ground.velocity.x = -(8+2*score/100);
      trex.velocity.y = trex.velocity.y + 0.85;
      trex.changeAnimation("running", trex_running);

      if(ground.x < 0){
        ground.x = ground.width / 2;
      }

      if(groupO.isTouching(trex)){
        d.play();
        //j.play();
        gameState = END;
        //trex.velocityY = -15
      }


      spamc();
      spamo();

      go.visible = false;
      r.visible = false;
    }else if(gameState === END){
      trex.changeAnimation("collided", trex_death);
      ground.velocityX = 0;
      trex.velocityY = 0;
      groupC.setVelocityXEach(0);
      groupO.setVelocityXEach(0);
      groupO.setLifetimeEach(-1);
      groupC.setLifetimeEach(-1);
      if(mousePressedOver(r)){
        restart();
      }
      
      go.visible = true;
      r.visible = true;
   }


  trex.collide(invisground);

drawSprites();
}

function spamc(){ 
  if(frameCount % 120 === 0){
  
  cloud = createSprite(width-20,height-10,400,10);
  cloud.velocityX = -2;
  cloud.addImage("cloud",cloudpng);
  cloud.y = Math.round(random(250,150));
  cloud.lifetime = 530;
  cloud.depth = trex.depth;
  groupC.add(cloud);

  gO.depth = trex.depth;
  trex.depth = trex.depth + 1;

  cloud.depth = gO.depth
  gO.depth = gO.depth + 1;

  }
}

function spamo(){
  if(frameCount % 120 === 0){

    obstacle = createSprite(width+10,height-150,400,10);
    obstacle.velocityX = -(8+score/100);
    var rand = Math.round(random(1,6));
  
     switch(rand){
      case 1: obstacle.addImage(o);
      break;
      case 2: obstacle.addImage(o1);
      break;
      case 3: obstacle.addImage(o2);
      break;
      case 4: obstacle.addImage(o3);
      break;
      case 5: obstacle.addImage(o4);
      break;
      case 6: obstacle.addImage(o5);
      break;
      default: break;
    }
    obstacle.scale = 0.8;
    obstacle.lifetime = 175;
    groupO.add(obstacle);
  }


}

function restart(){
  gameState = PLAY;
  go.visible = false;
  r.visible = false;
  groupC.destroyEach();
  groupO.destroyEach();
  score = 0;
}