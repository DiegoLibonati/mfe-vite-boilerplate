import { http, HttpResponse } from "msw";

import type { User } from "shared/sdk";

import userService from "@container/services/userService";

import { mockMswServer } from "@tests/__mocks__/mswServer.mock";
import { mockUser } from "@tests/__mocks__/user.mock";

describe("userService", () => {
  describe("getAll", () => {
    it("should return the list of users from the API", async () => {
      const mockUsers: User[] = [mockUser];
      mockMswServer.use(http.get("/api/users", () => HttpResponse.json(mockUsers)));

      const result = await userService.getAll();

      expect(result).toEqual(mockUsers);
    });

    it("should return an empty array when the API returns no users", async () => {
      mockMswServer.use(http.get("/api/users", () => HttpResponse.json([])));

      const result = await userService.getAll();

      expect(result).toEqual([]);
    });

    it("should throw when the API responds with a server error", async () => {
      mockMswServer.use(http.get("/api/users", () => new HttpResponse(null, { status: 500 })));

      await expect(userService.getAll()).rejects.toThrow("HTTP error! status: 500");
    });

    it("should throw on network error", async () => {
      mockMswServer.use(http.get("/api/users", () => HttpResponse.error()));

      await expect(userService.getAll()).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("should return the user when it exists", async () => {
      mockMswServer.use(http.get("/api/users/:id", () => HttpResponse.json(mockUser)));

      const result = await userService.getById(1);

      expect(result).toEqual(mockUser);
    });

    it("should throw when the API responds with 404", async () => {
      mockMswServer.use(http.get("/api/users/:id", () => new HttpResponse(null, { status: 404 })));

      await expect(userService.getById(999)).rejects.toThrow("HTTP error! status: 404");
    });

    it("should throw on network error", async () => {
      mockMswServer.use(http.get("/api/users/:id", () => HttpResponse.error()));

      await expect(userService.getById(1)).rejects.toThrow();
    });
  });
});
