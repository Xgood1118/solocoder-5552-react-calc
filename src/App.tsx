import { createHashRouter, RouterProvider } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import CalculatorPage from '@/pages/CalculatorPage';
import MatrixPage from '@/pages/MatrixPage';
import ConverterPage from '@/pages/ConverterPage';

const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <CalculatorPage /> },
      { path: '/matrix', element: <MatrixPage /> },
      { path: '/converter', element: <ConverterPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
