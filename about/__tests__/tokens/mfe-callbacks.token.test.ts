import { TestBed } from "@angular/core/testing";

import type { MfeCallbacks } from "shared/sdk";

import { MFE_CALLBACKS } from "@about/tokens/mfe-callbacks.token";

describe("MFE_CALLBACKS", () => {
  it("should be injectable when provided with a value", () => {
    const mockCallbacks: MfeCallbacks = {
      onNavigate: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: MFE_CALLBACKS, useValue: mockCallbacks }],
    });

    const callbacks = TestBed.inject(MFE_CALLBACKS);

    expect(callbacks).toBe(mockCallbacks);
  });

  it("should invoke the onNavigate callback with the given path", () => {
    const mockOnNavigate = jest.fn();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MFE_CALLBACKS,
          useValue: { onNavigate: mockOnNavigate } as MfeCallbacks,
        },
      ],
    });

    const callbacks = TestBed.inject(MFE_CALLBACKS);
    callbacks.onNavigate("/about");

    expect(mockOnNavigate).toHaveBeenCalledWith("/about");
  });

  it("should support the optional onEvent callback", () => {
    const mockOnEvent = jest.fn();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MFE_CALLBACKS,
          useValue: {
            onNavigate: jest.fn(),
            onEvent: mockOnEvent,
          } as MfeCallbacks,
        },
      ],
    });

    const callbacks = TestBed.inject(MFE_CALLBACKS);
    callbacks.onEvent?.({
      type: "counterChange",
      payload: { counter: 5 },
    });

    expect(mockOnEvent).toHaveBeenCalledWith({
      type: "counterChange",
      payload: { counter: 5 },
    });
  });
});
