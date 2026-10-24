import { expect, test } from "vitest";
import { sumar } from "../functions/sumar";

test("suma 2 y 3 debe ser = 5", () => {
    expect(sumar(2, 3)).toBe(5);
})