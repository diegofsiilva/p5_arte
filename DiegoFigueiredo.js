new p5(function(p) {
  const W = 400, H = 400;
  const HALF = W / 2;
  const BG = '#e8e2d5';
  const FG = '#1a1a1a';
  const BORDER = 10;
  const DIVIDER = 6;
  const STRIPE = 13;
  const RATIO = 0.62;
  const ANIM_DURATION = 5000;

  // Ângulos corretos:
  // sup esq → vertical (90°)
  // sup dir → horizontal (0°)
  // inf esq → diagonal \  (45°)
  // inf dir → diagonal /  (-45°)
  const baseAngles = [0, 90, 45, -45];

  let animating = false;
  let played = false;
  let startTime = 0;

  p.setup = function() {
    let cnv = p.createCanvas(W, H);
    cnv.parent('c');
    cnv.mouseClicked(function() {
      if (!animating && !played) {
        animating = true;
        played = true;
        startTime = p.millis();
        document.getElementById('hint').style.opacity = '0';
        p.loop();
      }
    });
    p.noLoop();
    drawFrame(0);
  };

  function drawQuadrant(qx, qy, qw, qh, angleDeg, phase) {
    let g = p.createGraphics(qw, qh);
    g.background(BG);
    g.stroke(FG);
    g.strokeWeight(STRIPE * RATIO);
    g.push();
    g.translate(qw / 2, qh / 2);
    g.rotate(p.radians(angleDeg));
    let diag = p.sqrt(qw * qw + qh * qh);
    for (let i = -diag + (phase % STRIPE); i < diag; i += STRIPE) {
      g.line(i, -diag, i, diag);
    }
    g.pop();
    p.image(g, qx, qy);
    g.remove();
  }

  function drawFrame(time) {
    p.background(BG);

    let innerX = BORDER;
    let innerY = BORDER;
    let innerW = W - BORDER * 2;
    let innerH = H - BORDER * 2;

    let qw = Math.floor((innerW - DIVIDER) / 2);
    let qh = Math.floor((innerH - DIVIDER) / 2);
    let half = Math.floor(DIVIDER / 2);

    let positions = [
      { x: innerX,            y: innerY },
      { x: innerX + qw + DIVIDER, y: innerY },
      { x: innerX,            y: innerY + qh + DIVIDER },
      { x: innerX + qw + DIVIDER, y: innerY + qh + DIVIDER },
    ];

    let phase = (time * 30) % STRIPE;

    for (let q = 0; q < 4; q++) {
      drawQuadrant(positions[q].x, positions[q].y, qw, qh, baseAngles[q], phase);
    }

    // Borda externa
    p.noFill();
    p.stroke(FG);
    p.strokeWeight(BORDER * 2);
    p.rect(0, 0, W, H);

    // Divisórias internas
    p.strokeWeight(DIVIDER);
    let midX = innerX + qw + half;
    let midY = innerY + qh + half;
    p.line(midX, innerY, midX, innerY + innerH);
    p.line(innerX, midY, innerX + innerW, midY);
  }

  p.draw = function() {
    let elapsed = p.millis() - startTime;
    if (elapsed >= ANIM_DURATION) {
      animating = false;
      p.noLoop();
      drawFrame(0);
      return;
    }
    drawFrame(elapsed / 1000);
  };

}, document.getElementById('c'));