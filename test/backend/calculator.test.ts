import {PhaseShiftCalculator, PhaseShiftResult, PhaseShiftParams} from '../../app/services/calculator/phase-shift-calculator';

describe("Backend scheduler", () => {
  it("should construct a proper object", () => {
    const params: PhaseShiftParams = {
      launch_time: new Date(),
    };
    const calculator = new PhaseShiftCalculator(params);

    expect(calculator).toBeInstanceOf(PhaseShiftCalculator);
    expect(calculator.calculate()).toHaveProperty('days');
  });
  it("should calculate simple time shift", () => {
    const params: PhaseShiftParams = {
      launch_time: new Date(),
    };
    const calculator = new PhaseShiftCalculator(params);

    expect(calculator).toBeInstanceOf(PhaseShiftCalculator);
    expect(calculator.calculate()).toHaveProperty('days');
  });
});
