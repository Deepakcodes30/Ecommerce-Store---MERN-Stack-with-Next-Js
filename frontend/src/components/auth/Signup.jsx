"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";
import { registerUser } from "@/services/users.api.js";

function Signup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [signupError, setSignupError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setSignupError(null);

    if (data.password.length < 8) {
      setSignupError("Password must be at least 8 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setSignupError("Please enter a valid email");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("password", data.password);

    if (data.avatar?.[0]) {
      const file = data.avatar[0];

      if (file.size > 2 * 1024 * 1024) {
        setSignupError("Avatar must be less than 2MB");
        return;
      }

      formData.append("avatar", file);
    }

    try {
      setLoading(true);
      await registerUser(formData);
      reset();
      router.push("/");
    } catch (error) {
      setSignupError(error?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Signup Form</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="file"
          label="Avatar"
          accept="image/*"
          {...register("avatar")}
        />

        <Input
          label="Full Name"
          type="text"
          {...register("fullName", { required: true })}
        />
        {errors.fullName && <p>Full name is required</p>}

        <Input
          label="Email"
          type="text"
          {...register("email", { required: true })}
        />
        {errors.email && <p>Email is required</p>}

        <Input
          label="Phone Number"
          type="text"
          {...register("phoneNumber", { required: true })}
        />
        {errors.phoneNumber && <p>Phone number is required</p>}

        <Input
          label="Password"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && <p>Password is required</p>}

        {signupError && <p className="error">{signupError}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Registering user..." : "Register"}
        </Button>
        <p className="text-center">
          Have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
