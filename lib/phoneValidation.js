/**
 * lib/phoneValidation.js
 *
 * Shared phone validation for every public-facing form that collects a
 * phone number. Uses libphonenumber-js — deliberately called WITHOUT a
 * default country, which means it only accepts full international format
 * ("+<country code><number>"). That's what forces the person to include
 * their country code: a bare local number like "9876543210" fails
 * validation, not because we reject it on format, but because there's no
 * country code for libphonenumber-js to validate the rest of the digits
 * against.
 */
import { isValidPhoneNumber } from "libphonenumber-js";

/**
 * @param {string} rawValue - whatever the person has typed so far
 * @returns {{ valid: boolean, error: string | null }}
 *   error is null when valid, or when the field is simply empty (don't
 *   show "invalid" for an untouched/empty field — let `required` handle
 *   that). Callers should still block submit on an empty value themselves.
 */
export function validatePhone(rawValue) {
  const value = (rawValue || "").trim();

  if (!value) {
    return { valid: false, error: null };
  }

  if (!value.startsWith("+")) {
    return {
      valid: false,
      error: "Include your country code, e.g. +91XXXXXXXXXX",
    };
  }

  if (!isValidPhoneNumber(value)) {
    return { valid: false, error: "This phone number is invalid" };
  }

  return { valid: true, error: null };
}
