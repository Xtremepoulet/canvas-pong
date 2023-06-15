const canvas = document.querySelector("#canvas");
let ctx = canvas.getContext('2d');

let p1 = document.querySelector("#player1");
let p2 = document.querySelector("#player2");

 


//objet mouse pour le control de notre rectangle
const mouse = {
    x: 100,
    y: 350
}



//class qui gere notre ball en fonction de l'axe de la balle
class Ball{
    constructor(x,y,radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = 'white';
        this.velocityX = generate_random_number(10,15); 
        this.velocityY = generate_random_number(10,15);

        //points des joueurs 
        this.p1_points = 1;
        this.p2_points = 1;
    }


    update(){
        this.draw();

        this.x += this.velocityX;
        this.y += this.velocityY;

        //check if collision exist between rectangle_plyer and the ball
        if (rectangle_circle_collision(rectangle_player2, this) === true){
            this.velocityX = -this.velocityX;

        }
        if (rectangle_circle_collision(rectangle_player1, this) === true){
            this.velocityX = -this.velocityX;

        }



        //check if collision exist between the canvas and the ball, only on the x axis 
        if (this.y + this.velocityY > canvas.height ||
            this.y + this.velocityY < 0){
                this.velocityY = -this.velocityY;

            } 


        //check if ball go outside 
        if (this.x + this.velocityX > canvas.width){    
            p1.innerText = `Player1: ${this.p1_points}`;
            this.p1_points += 1;

            new_game(this);
        }

        if (this.x + this.velocityX < 0){
            p2.innerText = `Player2: ${this.p2_points}`;
            this.p2_points += 1;

            //faire une fonction pour tout remettre à 0 
            new_game(this)
        }
            


    }



    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        ctx.strokeStyle = this.color;
        ctx.fill();
    }
}






//class qui gere les rectangles que nous allons manipuler
class Rectangle{
    constructor(x,y,width, height){
        this.x = x;
        this.y = y;
        this.width = width; 
        this.height = height;
        this.velocity = 10;
    }

    update(){
        this.draw();
    }


    draw(){
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}





//gestion des evenements souris pour jouer (ici position mouse.x et mouse.y)
addEventListener('mousemove', event => {
    mouse.y = event.clientY;
    mouse.x = event.clientX;

        //mise à jour de y pour notre rectangle1
    if(mouse.x >= canvas.width / 2){
        rectangle_player2.y = mouse.y;
    } 
    else if (mouse.x <= canvas.width / 2) {
            rectangle_player1.y = mouse.y;
    }

})





//gestion des collisions entre la ball et les rectangles des joueurs
const rectangle_circle_collision = (rectangle, circle) => {
    //trouver la distance horizontale et verticale entre le centre du cercle et le centre du rectangle
    let  distanceX = Math.abs(circle.x - rectangle.x - rectangle.width / 2);
    let distanceY = Math.abs(circle.y - rectangle.y - rectangle.height / 2);

    //control de la distance entre les deux si > a la moitie du cercle + la moitié du rectangle, alors ils ne sont pas proche
    if (distanceX > (rectangle.width /2 + circle.radius)) {
        return false; //ils ne collide pas 
    }

    if (distanceY > (rectangle.height / 2 + circle.radius)){
        return false;
    }


    //control de la distance si collided. si distance < la moitié du rectangle
    if (distanceX <= (rectangle.width / 2)){
        return true; //ils collide
    }

    if (distanceY <= (rectangle.height / 2)){
        return false; 
    }

    //si rien, retourne la distance entre les points 
    let dx = distanceX - rectangle.width/2;
    let dy = distanceY - rectangle.height/2;
    return (dx*dx+dy*dy<=(circle.radius*circle.radius));

}









//declaration en dehors pour appel
let ball;
let rectangle_player1;
let rectangle_player2;


//on va init notre jeu
const init = () => { 



    ball = new Ball(canvas.width / 2,canvas.height / 2, 10);
    rectangle_player1 = new Rectangle(mouse.x, mouse.y, 18, 90);
    rectangle_player2 = new Rectangle(1600, mouse.y, 18, 90);





    //initialisation de la velocité 
 
    let random_direction = generate_random_number(0,21);
    if (random_direction % 2 === 0){
        ball.velocityX = -generate_random_number(10,15);
        
        if (random_direction >= 10){
            ball.velocityY = generate_random_number(6,15);
        }

        else {
            ball.velocityY = -generate_random_number(6,15);
        }
    }


    else if (random_direction % 2 !== 0){
        ball.velocityX = generate_random_number(10,15);
        
        if (random_direction >= 10){
            ball.velocityY = -generate_random_number(6,15);
        }

        else {
            ball.velocityY = generate_random_number(6,15);
        }
    }
    
}









let balls_index = 1; //definissions de i pour nos index de balls

//on definit notre animation avec les frames
const animation = () => {
    requestAnimationFrame(animation);
    ctx.clearRect(0,0,canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.stroke();

    //creation d'une ligne au millieu du canevas + un cercle pour le lancement de la balle
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillRect(canvas.width / 2, 0, 10,800);

    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + 4, canvas.height / 2, 20, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
    

    ctx.restore();
    ball.update();

    



    rectangle_player1.update();
    rectangle_player2.update();
}






// remet tout a jour pour continuer à jouer
const new_game = (ball) => {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    ball.velocityX = generate_random_number(4,15);
    ball.velocityY = generate_random_number(4,15);
}



const generate_random_number = (min=0, max=21) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}






init(ball);
animation();





//test pour affichage

// let ball = new Ball(50,50,10);
// ball.update();

// let rect = new Rectangle(50, 350, 10, 80);
// rect.update();
