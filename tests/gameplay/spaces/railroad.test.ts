import { RailRoad } from "../../../src/gameplay/spaces/railroad";
import { RailRoadStatus } from "../../../src/gameplay/shared/interfaces";

describe("RailRoad", () => {
  let railRoad: RailRoad;
  const rrParam = {
    name: "railroad",
    mortgage: 20,
    rents: [0, 10, 20, 30, 40, 50, 60],
    cost: 5,
  };

  beforeEach(() => {
    railRoad = new RailRoad(rrParam);
    railRoad.purchase();
  });

  test("purchase()", () => {
    expect(railRoad.rent).toEqual(rrParam.rents[1]);
    expect(railRoad.status).toEqual(RailRoadStatus.OneRail);
  });

  test("getRent()", () => {
    expect(railRoad.getRent()).toEqual(rrParam.rents[1]);
  });

  test("upgrade()", () => {
    railRoad.upgrade();

    expect(railRoad.status).toEqual(RailRoadStatus.TwoRail);
    expect(railRoad.getRent()).toEqual(rrParam.rents[2]);
  });

  test("downgrade()", () => {
    railRoad.status = RailRoadStatus.TwoRail;
    railRoad.rent = rrParam.rents[2];
    railRoad.downgrade();

    expect(railRoad.status).toEqual(RailRoadStatus.OneRail);
    expect(railRoad.getRent()).toEqual(rrParam.rents[1]);
  });

  test("setMortgage()", () => {
    railRoad.setMortgage();

    expect(railRoad.status).toEqual(RailRoadStatus.Mortgage);
    expect(railRoad.getRent()).toEqual(rrParam.rents[0]);
  });
});
