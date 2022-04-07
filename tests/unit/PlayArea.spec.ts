import { shallowMount } from "@vue/test-utils";
import PlayArea from "@/components/PlayArea";
import { mockPgnText } from "./test_objects";

const TEST_PGN_GAME_COUNT = 4;

describe("PlayArea.vue", () => {
  const wrapper = shallowMount(PlayArea, {
    propsData: { pgnString: mockPgnText }
  });

  wrapper.vm.updateGameList();

  it("parses and loads PGN", () => {
    expect(wrapper.vm.gameList).toBeDefined();
    expect(wrapper.vm.gameList.length).toEqual(TEST_PGN_GAME_COUNT);
    expect(wrapper.vm.gameListOptions.length).toEqual(TEST_PGN_GAME_COUNT);
  });

  it("handles null selectedGame", () => {
    wrapper.vm.selectedGame = null;
    expect(wrapper.vm.selectedGame).toBeNull();
    expect(wrapper.vm.side).toEqual("white");
    expect(wrapper.vm.gameHeaderText.firstline).toEqual("");
    expect(wrapper.vm.gameHeaderText.secondline).toEqual("");
    expect(wrapper.vm.noAnnotationsAvailable).toBeFalsy();
  });

  it("resets position correctly", () => {
    const testFen = wrapper.vm.gameList[0];
    wrapper.vm.selectedGame = wrapper.vm.gameList[0];
    wrapper.vm.resetPosition();
    setTimeout(() => expect(wrapper.vm.currentFen).toEqual(testFen), 0);
  });

  it("does not show fields with missing data as question marks", () => {
    wrapper.vm.selectedGame = wrapper.vm.gameList[1];

    // Game label
    expect(wrapper.vm.selectedGame).toBeDefined();
    expect(wrapper.vm.selectedGame).not.toBeNull();
    expect(
      wrapper.vm.selectedGame &&
        wrapper.vm.selectedGame.label &&
        wrapper.vm.selectedGame.label.includes("?")
    ).toBeFalsy();

    // Game header
    expect(wrapper.vm.gameHeaderText.firstline.includes("?")).toBeFalsy();
    expect(wrapper.vm.gameHeaderText.secondline.includes("?")).toBeFalsy();
  });

  it("detects when no annotation is available", () => {
    wrapper.vm.selectedGame = wrapper.vm.gameList[0];
    expect(wrapper.vm.noAnnotationsAvailable).toBeFalsy();
    wrapper.vm.selectedGame = wrapper.vm.gameList[2];
    expect(wrapper.vm.noAnnotationsAvailable).toBeTruthy();
  });

  it("identifies side to move", () => {
    wrapper.vm.selectedGame = wrapper.vm.gameList[1];
    expect(wrapper.vm.side).toEqual("white");
    wrapper.vm.selectedGame = wrapper.vm.gameList[3];
    expect(wrapper.vm.side).toEqual("black");
  });
});
