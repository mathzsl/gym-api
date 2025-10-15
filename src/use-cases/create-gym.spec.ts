import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { describe } from "node:test";
import { beforeEach, expect, it } from "vitest";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;
describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to create a gym", async () => {
    const { gym } = await sut.execute({
      name: "JavaScript Gym",
      description: "Some description",
      phone: "11999999999",
      latitude: -23.588068,
      longitude: -46.656419,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
