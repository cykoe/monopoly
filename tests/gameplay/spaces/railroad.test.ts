import { RailRoad } from "../../../src/gameplay/spaces/railroad";
import { RailRoadStatus } from "../../../src/gameplay/shared/interfaces";

describe("RailRoad", () => {
  let railRoad: RailRoad;
  const rrParam = {
    name: "name",
    rents: [0, 10, 20, 30, 40, 0],
  };

  beforeEach(() => {
    railRoad = new RailRoad(rrParam);
  });

  test("purchase()", () => {
    railRoad.purchase();

    expect(railRoad.rent).toEqual(railRoad.rents[RailRoadStatus.OneRail]);
    expect(railRoad.status).toEqual(RailRoadStatus.OneRail);
  });

  test("getRent()", () => {
    expect(railRoad.getRent()).toEqual(
      railRoad.rents[RailRoadStatus.Unclaimed]
    );
  });

  test("upgrade()", () => {
    railRoad.status = RailRoadStatus.OneRail;
    railRoad.rent = railRoad.rents[RailRoadStatus.OneRail];
    railRoad.upgrade();

    expect(railRoad.status).toEqual(RailRoadStatus.TwoRail);
    expect(railRoad.getRent()).toEqual(railRoad.rents[RailRoadStatus.TwoRail]);
  });

  test("downgrade()", () => {
    railRoad.status = RailRoadStatus.TwoRail;
    railRoad.rent = rrParam.rents[RailRoadStatus.TwoRail];
    railRoad.downgrade();

    expect(railRoad.status).toEqual(RailRoadStatus.OneRail);
    expect(railRoad.getRent()).toEqual(railRoad.rents[RailRoadStatus.OneRail]);
  });

  test("setMortgage()", () => {
    railRoad.setMortgage();

    expect(railRoad.status).toEqual(RailRoadStatus.Mortgage);
    expect(railRoad.getRent()).toEqual(railRoad.rents[RailRoadStatus.Mortgage]);
  });
});
