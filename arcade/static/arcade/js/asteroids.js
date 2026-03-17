const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const FPS = 30; // frames per second
const FRICTION = 0.7; // friction coefficient of space (0 = no friction, 1 = lots)
const SHIP_SIZE = 30; // ship height in pixels
const SHIP_THRUST = 5; // acceleration of the ship in pixels per second per second
const TURN_SPEED = 360; // turn speed in degrees per second

let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    a: 90 / 180 * Math.PI, // convert to radians
    r: SHIP_SIZE / 2,
    rot: 0,
    thrusting: false,
    thrust: {
        x: 0,
        y: 0
    },
    canShoot: true,
    lasers: []
};
const LASER_MAX = 10; // maximum number of lasers on screen at once
const LASER_SPD = 500; // speed of lasers in pixels per second
const LASER_DIST = 0.5; // max distance laser can travel as fraction of screen width

let roids = [];
const ROID_NUM = 3;
const ROID_SIZE = 100;
const ROID_SPD = 50;
const ROID_VERT = 10; // avg number of vertices
const ROID_JAG = 0.4; // asteroid jaggedness (0 = none, 1 = lots)

function createAsteroidBelt() {
    roids = [];
    let x, y;
    for (let i = 0; i < ROID_NUM; i++) {
        do {
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
        } while (distBetweenPoints(ship.x, ship.y, x, y) < ROID_SIZE * 2 + ship.r);
        roids.push(newAsteroid(x, y, Math.ceil(ROID_SIZE / 2)));
    }
}

function distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function newAsteroid(x, y, r) {
    let lvlMult = 1;
    let roid = {
        x: x,
        y: y,
        xv: Math.random() * ROID_SPD * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1),
        yv: Math.random() * ROID_SPD * lvlMult / FPS * (Math.random() < 0.5 ? 1 : -1),
        r: r,
        a: Math.random() * Math.PI * 2, // in radians
        vert: Math.floor(Math.random() * (ROID_VERT + 1) + ROID_VERT / 2),
        offs: []
    };
    
    // populate the offsets array
    for (let i = 0; i < roid.vert; i++) {
        roid.offs.push(Math.random() * ROID_JAG * 2 + 1 - ROID_JAG);
    }
    
    return roid;
}

createAsteroidBelt();

function shootLaser() {
    // create the laser object
    if (ship.canShoot && ship.lasers.length < LASER_MAX) {
        ship.lasers.push({ // from the nose of the ship
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
            xv: LASER_SPD * Math.cos(ship.a) / FPS,
            yv: -LASER_SPD * Math.sin(ship.a) / FPS,
            dist: 0
        });
    }
    // Set reload time (could be implemented, for now prevent multiple per frame if needed. 
    // Wait, simple spacebar listener usually fires once per keystroke.
}

document.addEventListener("keydown", function(e) {
    if(e.keyCode === 32) {
        e.preventDefault(); // prevent spacebar scroll
        shootLaser();
    }
    
    switch(e.keyCode) {
        case 37: // left arrow
            ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
            e.preventDefault();
            break;
        case 38: // up arrow
            ship.thrusting = true;
            e.preventDefault();
            break;
        case 39: // right arrow
            ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;
            e.preventDefault();
            break;
    }
});

document.addEventListener("keyup", function(e) {
    switch(e.keyCode) {
        case 37: // left arrow
            ship.rot = 0;
            break;
        case 38: // up arrow
            ship.thrusting = false;
            break;
        case 39: // right arrow
            ship.rot = 0;
            break;
    }
});

function draw() {
    // draw space
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // thrust the ship
    if (ship.thrusting) {
        ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
        ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;
        
        ctx.fillStyle = "#ff107a";
        ctx.strokeStyle = "#ff107a";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ff107a";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(
            ship.x - ship.r * (1.5 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
            ship.y + ship.r * (1.5 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
        );
        ctx.lineTo(
            ship.x - ship.r * 2 * Math.cos(ship.a),
            ship.y + ship.r * 2 * Math.sin(ship.a)
        );
        ctx.lineTo(
            ship.x - ship.r * (1.5 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
            ship.y + ship.r * (1.5 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
    } else {
        // apply friction
        ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
        ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
    }

    // draw triangular ship
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#0ff";
    ctx.beginPath();
    ctx.moveTo(
        ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
        ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
    );
    ctx.lineTo(
        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a))
    );
    ctx.lineTo(
        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a))
    );
    ctx.closePath();
    ctx.stroke();
    
    // draw the asteroids
    let a, r, x, y, offs, vert;
    for (let i = 0; i < roids.length; i++) {
        ctx.strokeStyle = "#39ff14";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#39ff14";
        
        a = roids[i].a;
        r = roids[i].r;
        x = roids[i].x;
        y = roids[i].y;
        offs = roids[i].offs;
        vert = roids[i].vert;
        
        ctx.beginPath();
        for (let j = 0; j < vert; j++) {
            ctx.lineTo(
                x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
            );
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    ctx.shadowBlur = 0;

    // move ship
    ship.x += ship.thrust.x;
    ship.y += ship.thrust.y;

    // handle edge of screen
    if (ship.x < 0 - ship.r) {
        ship.x = canvas.width + ship.r;
    } else if (ship.x > canvas.width + ship.r) {
        ship.x = 0 - ship.r;
    }
    if (ship.y < 0 - ship.r) {
        ship.y = canvas.height + ship.r;
    } else if (ship.y > canvas.height + ship.r) {
        ship.y = 0 - ship.r;
    }

    // move asteroids
    for (let i = 0; i < roids.length; i++) {
        roids[i].x += roids[i].xv;
        roids[i].y += roids[i].yv;
        
        if (roids[i].x < 0 - roids[i].r) {
            roids[i].x = canvas.width + roids[i].r;
        } else if (roids[i].x > canvas.width + roids[i].r) {
            roids[i].x = 0 - roids[i].r;
        }
        if (roids[i].y < 0 - roids[i].r) {
            roids[i].y = canvas.height + roids[i].r;
        } else if (roids[i].y > canvas.height + roids[i].r) {
            roids[i].y = 0 - roids[i].r;
        }
    }
    
    // Move lasers
    for (let i = ship.lasers.length - 1; i >= 0; i--) {
        // check distance traveled
        if (ship.lasers[i].dist > LASER_DIST * canvas.width) {
            ship.lasers.splice(i, 1);
            continue;
        }

        // move the laser
        ship.lasers[i].x += ship.lasers[i].xv;
        ship.lasers[i].y += ship.lasers[i].yv;

        // calculate distance traveled
        ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));

        // handle edge of screen
        if (ship.lasers[i].x < 0) {
            ship.lasers[i].x = canvas.width;
        } else if (ship.lasers[i].x > canvas.width) {
            ship.lasers[i].x = 0;
        }
        if (ship.lasers[i].y < 0) {
            ship.lasers[i].y = canvas.height;
        } else if (ship.lasers[i].y > canvas.height) {
            ship.lasers[i].y = 0;
        }
    }

    // Detect laser hits on asteroids
    let ax, ay, ar, lx, ly;
    for (let i = roids.length - 1; i >= 0; i--) {
        ax = roids[i].x;
        ay = roids[i].y;
        ar = roids[i].r;

        for (let j = ship.lasers.length - 1; j >= 0; j--) {
            lx = ship.lasers[j].x;
            ly = ship.lasers[j].y;

            if (distBetweenPoints(ax, ay, lx, ly) < ar) {
                // remove the laser
                ship.lasers.splice(j, 1);
                // remove the asteroid (a simple immediate destroy for now)
                roids.splice(i, 1);
                
                // if we destroy all asteroids, make a new belt
                if (roids.length === 0) {
                    createAsteroidBelt();
                }
                break;
            }
        }
    }

    // draw the lasers
    for (let i = 0; i < ship.lasers.length; i++) {
        ctx.fillStyle = "salmon";
        ctx.beginPath();
        ctx.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
        ctx.fill();
    }
    
    // rotate ship
    ship.a += ship.rot;
}

setInterval(draw, 1000 / FPS);
