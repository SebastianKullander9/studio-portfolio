export const scrambleConfig = {
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ",
    neighbourRadius: 2, // chars affected on each side of cursor
    scrambleDuration: 500, // ms before resolve triggers
    scrambleInterval: 50, // ms between scramble frames
    resolveFrames: 25, // steps in resolve animation
    resolveInterval: 25, // ms between resolve frames
    resolveLeaveInterval: 10, // ms between frames on mouseleave
} as const;
