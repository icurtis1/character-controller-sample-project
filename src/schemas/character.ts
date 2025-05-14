import { z } from 'zod';

// Character Physics Configuration Schema
export const CharacterPhysicsSchema = z.object({
  moveSpeed: z.number()
    .min(0, "Move speed cannot be negative")
    .max(100, "Move speed cannot exceed 100")
    .default(25),
  jumpForce: z.number()
    .min(0, "Jump force cannot be negative")
    .max(50, "Jump force cannot exceed 50")
    .default(15),
  dampening: z.number()
    .min(0, "Dampening cannot be negative")
    .max(1, "Dampening cannot exceed 1")
    .default(0.6),
});

// Character State Schema
export const CharacterStateSchema = z.object({
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  velocity: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  isGrounded: z.boolean(),
  isJumping: z.boolean(),
  lastJumpTime: z.number(),
});

// Character Input Schema
export const CharacterInputSchema = z.object({
  forward: z.boolean(),
  backward: z.boolean(),
  left: z.boolean(),
  right: z.boolean(),
  jump: z.boolean(),
});