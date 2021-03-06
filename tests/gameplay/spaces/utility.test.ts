import { Utility } from "../../../src/gameplay/spaces/utility";
import { UtilityStatus } from "../../../src/gameplay/shared/interfaces";

// TODO: integration test
describe("Utility", () => {
  let utility: Utility;
  const uParam = {
    name: "name",
    rents: [0, 4, 10, 0],
  };

  beforeEach(() => {
    utility = new Utility(uParam);
  });

  test("purchase()", () => {
    utility.purchase();

    expect(utility._rent).toEqual(utility.rents[UtilityStatus.OneUtility]);
    expect(utility.status).toEqual(UtilityStatus.OneUtility);
  });

  test("getRent", () => {
    utility._rent = utility.rents[UtilityStatus.OneUtility];
    utility.status = UtilityStatus.OneUtility;
    const steps = 4;

    expect(utility.getRent(steps)).toEqual(
      utility.rents[UtilityStatus.OneUtility] * steps
    );
  });

  test("upgrade", () => {
    utility._rent = utility.rents[UtilityStatus.OneUtility];
    utility.status = UtilityStatus.OneUtility;
    utility.upgrade();

    expect(utility.status).toEqual(UtilityStatus.TwoUtility);
    expect(utility._rent).toEqual(utility.rents[UtilityStatus.TwoUtility]);
  });

  test("downgrade", () => {
    utility._rent = utility.rents[UtilityStatus.TwoUtility];
    utility.status = UtilityStatus.TwoUtility;
    utility.downgrade();

    expect(utility.status).toEqual(UtilityStatus.OneUtility);
    expect(utility._rent).toEqual(utility.rents[UtilityStatus.OneUtility]);
  });
});
