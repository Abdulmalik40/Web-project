<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * Authentication Controller
 * Handles user registration, login, logout, and getting current user info
 * Uses Laravel Sanctum for token-based authentication
 */
class AuthController extends Controller
{
    /**
     * Register a new user
     * Creates user account and returns authentication token
     * The token should be saved by frontend and sent in Authorization header for protected routes
     * 
     * POST /api/register
     * Required fields: name, email (unique), password (min 6 characters)
     */
    public function register(Request $request)
    {
        // Validate input data - ensures required fields are present and email is unique
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email', // Email must not exist in users table
            'password' => 'required|string|min:6', // Password minimum 6 characters
        ]);

        // Create new user with hashed password
        // Hash::make() encrypts the password so it's not stored in plain text
        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']), // Password is hashed before saving
        ]);

        // Create API token for immediate authentication after registration
        // Frontend will use this token to authenticate future requests
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token, // Frontend should save this token
        ], 201);
    }

    /**
     * Authenticate user and return token
     * Verifies email and password, then creates new token for authenticated sessions
     * 
     * POST /api/login
     * Required fields: email, password
     */
    public function login(Request $request)
    {
        // Validate that email and password are provided
        $fields = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Find user by email address
        $user = User::where('email', $fields['email'])->first();

        // Check if user exists - if not, return error (same message for security)
        // We don't specify if email or password is wrong to prevent email enumeration
        if (!$user) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Verify password matches the hashed password in database
        // Hash::check() compares plain password with stored hash
        if (!Hash::check($fields['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Create new API token for authenticated session
        // User can have multiple tokens (different devices)
        $token = $user->createToken('api_token')->plainTextToken;

        // Return user info and token - frontend saves token for future requests
        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token
        ]);
    }

    /**
     * Get current authenticated user information
     * The user is identified from the Bearer token in Authorization header
     * This route is protected by auth:sanctum middleware
     * 
     * GET /api/me
     */
    public function me(Request $request)
    {
        // $request->user() automatically gets user from token (set by middleware)
        return response()->json($request->user());
    }

    /**
     * Logout current user
     * Deletes all tokens for the authenticated user, forcing re-login
     * 
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        // Delete all tokens for this user - user will need to login again
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
