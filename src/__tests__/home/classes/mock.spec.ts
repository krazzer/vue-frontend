import { describe, it, expect } from "vitest";
import homeMock from "@/components/home/classes/mock";

describe('getModuleName', () => {
    it('gets module from url', () => {
        expect(homeMock.getModuleName('/link/to/module')).toBe('module')
    });
});