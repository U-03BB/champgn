// "as any" is recommended for SFC: https://github.com/vuejs/vue-test-utils/issues/255
/* eslint-disable @typescript-eslint/no-explicit-any */
import { shallowMount } from "@vue/test-utils";
import MoveAnnotation from "@/components/MoveAnnotation.vue";
import {
  mockMoveListWhiteStarts,
  mockMoveListBlackStarts,
  mockNags,
  mockNagsOutput
} from "./test_objects";

const MOVE_PAIR_COUNT = 1;

describe("MoveAnnotation.vue", () => {
  it("parses moves starting with white", () => {
    const wrapper = shallowMount(MoveAnnotation, {
      propsData: { moves: mockMoveListWhiteStarts }
    });
    expect((wrapper.vm as any).movepairs.length).toEqual(MOVE_PAIR_COUNT);
    expect((wrapper.vm as any).movepairs[0].blackStarts).toBeFalsy();
    expect((wrapper.vm as any).movepairs[0].white).toEqual(
      mockMoveListWhiteStarts[0]
    );
    expect((wrapper.vm as any).movepairs[0].black).toEqual(
      mockMoveListWhiteStarts[1]
    );
  });

  it("parses moves starting with black", () => {
    const wrapper = shallowMount(MoveAnnotation, {
      propsData: { moves: mockMoveListBlackStarts, blackStarts: true }
    });
    expect((wrapper.vm as any).movepairs.length).toEqual(MOVE_PAIR_COUNT + 1);
    expect((wrapper.vm as any).blackStarts).toBeTruthy();
    expect((wrapper.vm as any).movepairs[0].white).toBeUndefined();
    expect((wrapper.vm as any).movepairs[0].black).toEqual(
      mockMoveListBlackStarts[0]
    );
    expect((wrapper.vm as any).movepairs[1].white).toEqual(
      mockMoveListBlackStarts[1]
    );
    expect((wrapper.vm as any).movepairs[1].black).toBeUndefined();
  });

  it("parses NAGs", () => {
    const wrapper = shallowMount(MoveAnnotation, {
      propsData: { moves: mockMoveListWhiteStarts }
    });
    expect((wrapper.vm as any).Nag["$82"]).toEqual(
      "White has a moderately strong pawn structure"
    );
    expect((wrapper.vm as any).parseNags(mockNags)).toEqual(mockNagsOutput);
  });
});
