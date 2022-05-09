// "as any" is recommended for SFC: https://github.com/vuejs/vue-test-utils/issues/255
/* eslint-disable @typescript-eslint/no-explicit-any */
import { shallowMount } from "@vue/test-utils";
import MoveAnnotation from "@/components/MoveAnnotation.vue";
import "bootstrap-vue";
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
    const vm = wrapper.vm as any;
    expect(vm.movePairs.length).toEqual(MOVE_PAIR_COUNT);
    expect(vm.movePairs[0].blackStarts).toBeFalsy();
    expect(vm.movePairs[0].white).toEqual(mockMoveListWhiteStarts[0]);
    expect(vm.movePairs[0].black).toEqual(mockMoveListWhiteStarts[1]);
  });

  it("parses moves starting with black", () => {
    const wrapper = shallowMount(MoveAnnotation, {
      propsData: { moves: mockMoveListBlackStarts, blackStarts: true }
    });
    const vm = wrapper.vm as any;
    expect(vm.movePairs.length).toEqual(MOVE_PAIR_COUNT + 1);
    expect(vm.blackStarts).toBeTruthy();
    expect(vm.movePairs[0].white).toBeUndefined();
    expect(vm.movePairs[0].black).toEqual(mockMoveListBlackStarts[0]);
    expect(vm.movePairs[1].white).toEqual(mockMoveListBlackStarts[1]);
    expect(vm.movePairs[1].black).toBeUndefined();
  });

  it("parses NAGs", () => {
    const wrapper = shallowMount(MoveAnnotation, {
      propsData: { moves: mockMoveListWhiteStarts }
    });
    const vm = wrapper.vm as any;
    expect(vm.Nag["$82"]).toEqual(
      "White has a moderately strong pawn structure"
    );
    expect(vm.parseNags(mockNags)).toEqual(mockNagsOutput);
  });
});
