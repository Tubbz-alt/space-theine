export type PhaseShiftParams = {
  launch_time: Date
}

export type PhaseShiftResultDay = {
  sleep_at: Date,
}

export type PhaseShiftResult = {
  days: Array<PhaseShiftResultDay>,
}

export interface IPhaseShiftCalculator {
  calculate(): PhaseShiftResult;
}

export class PhaseShiftCalculator implements IPhaseShiftCalculator {
  private params: PhaseShiftParams;

  constructor(params: PhaseShiftParams) {
    this.params = params;
  }

  public calculate(): PhaseShiftResult {
    const day0: PhaseShiftResultDay = {
      sleep_at: new Date(),
    };
    return {days: [
      day0,
    ]};
  }
}
