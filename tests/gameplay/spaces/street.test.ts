import { Street } from "../../../src/gameplay/spaces/street";
import { StreetStatus } from "../../../src/gameplay/shared/interfaces";

describe("Street", () => {
  let street: Street;
  const sParam = {
    name: "name",
    rents: [0, 5, 10, 20, 30, 40, 50, 0],
  };

  beforeEach(() => {
    street = new Street(sParam);
  });

  test("purchase()", () => {
    street.purchase();

    expect(street.status).toEqual(StreetStatus.Unimproved);
    expect(street._rent).toEqual(street.rents[StreetStatus.Unimproved]);
  });

  test("getRent()", () => {
    expect(street.getRent()).toEqual(street.rents[StreetStatus.Unclaimed]);
  });

  test("upgrade()", () => {
    street._rent = street.rents[StreetStatus.Unimproved];
    street.status = StreetStatus.Unimproved;
    street.upgrade();

    expect(street.status).toEqual(StreetStatus.OneHouse);
    expect(street._rent).toEqual(street.rents[StreetStatus.OneHouse]);
  });

  test("downgrade()", () => {
    street._rent = street.rents[StreetStatus.Hotel];
    street.status = StreetStatus.Hotel;
    street.downgrade();

    expect(street.status).toEqual(StreetStatus.FourHouse);
    expect(street._rent).toEqual(street.rents[StreetStatus.FourHouse]);
  });

  test("setMortgage()", () => {
    street.setMortgage();

    expect(street.status).toEqual(StreetStatus.Mortgage);
    expect(street._rent).toEqual(street.rents[StreetStatus.Mortgage]);
  });

  test("doubleRent", () => {
    street._rent = street.rents[StreetStatus.Unimproved];
    street.status = StreetStatus.Unimproved;
    street.doubleRent();

    expect(street._rent).toEqual(street.rents[StreetStatus.Unimproved] * 2);
  });

  test("resetRent", () => {
    street.status = StreetStatus.Unimproved;
    street.resetRent();

    expect(street._rent).toEqual(street.rents[StreetStatus.Unimproved]);
  });
});
