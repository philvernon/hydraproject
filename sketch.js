osc(28, 0.025, 1.35)
  .modulateRotate(osc(5, -0.035, 0), 0.65)
  .modulate(noise(3, 0.08), 0.18)
  .kaleid(7)
  .scale(() => 1.1 + Math.sin(time * 0.17) * 0.12)
  .rotate(0, 0.025)
  .color(0.65, 0.85, 1)
  .saturate(1.6)
  .contrast(1.35)
  .mult(
    osc(80, -0.015, 0)
      .modulate(noise(2, 0.04), 0.12)
      .kaleid(7)
      .brightness(0.65),
    0.35
  )
  .blend(
    src(o0)
      .scale(1.008)
      .rotate(0.004)
      .color(0.99, 0.995, 1),
    0.78
  )
  .add(
    shape(7, 0.55, 0.008)
      .diff(shape(7, 0.535, 0.008))
      .rotate(0, -0.04)
      .repeat(3, 3)
      .modulateRotate(noise(2, 0.06), 0.6)
      .kaleid(7)
      .color(0.3, 0.7, 1),
    0.18
  )
  .scale(1, () => height / width, 1)
  .out(o0)

render(o0)
