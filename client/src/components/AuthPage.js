import React, { useState } from 'react';
import AuthLayout from './auth/AuthLayout';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

const LAYOUT_PROPS = {
  login: {
    heading: 'Learn smarter, not harder.',
    subheading: 'AI-powered study tools that turn any document into flashcards, quizzes, and summaries in seconds.',
  },
  register: {
    heading: 'Your AI study partner awaits.',
    subheading: 'Join thousands of students who are acing exams with personalized, AI-generated study materials.',
  },
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const props = isLogin ? LAYOUT_PROPS.login : LAYOUT_PROPS.register;

  return (
    <AuthLayout heading={props.heading} subheading={props.subheading}>
      {isLogin ? (
        <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </AuthLayout>
  );
};

export default AuthPage;