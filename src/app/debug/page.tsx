"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile } from "@/store/slices/authSlice";
import { useState } from "react";

export default function DebugPage() {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const { data: session, status } = useSession();
  const authState = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const forceProfileFetch = async () => {
    setFetchLoading(true);
    try {
      console.log("Forcing profile fetch...");
      const result = await dispatch(fetchUserProfile()).unwrap();
      console.log("Forced fetch result:", result);
    } catch (error) {
      console.error("Forced fetch error:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const checkAPI = async () => {
    setApiLoading(true);
    try {
      const response = await fetch("/api/debug/profile");
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: error instanceof Error ? error.message : 'Error desconocido' });
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Estado de Autenticación - Debug</h1>
        
        <div className="grid gap-6">
          {/* NextAuth Session */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">NextAuth Session</h2>
            <div className="space-y-2">
              <div><strong>Status:</strong> {status}</div>
              <div><strong>Session:</strong></div>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>

          {/* useAuth Hook */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">useAuth Hook</h2>
            <div className="space-y-2">
              <div><strong>isAuthenticated:</strong> {isAuthenticated.toString()}</div>
              <div><strong>isLoading:</strong> {isLoading.toString()}</div>
              <div><strong>isInitialized:</strong> {isInitialized.toString()}</div>
              <div><strong>User:</strong></div>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>

          {/* Redux State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Redux Auth State</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(authState, null, 2)}
            </pre>
          </div>

          {/* API Check */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Direct Check & Actions</h2>
            <div className="space-x-4 mb-4">
              <button 
                onClick={forceProfileFetch}
                disabled={fetchLoading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {fetchLoading ? "Fetching..." : "Force Profile Fetch"}
              </button>
              <button 
                onClick={checkAPI}
                disabled={apiLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {apiLoading ? "Checking..." : "Check API"}
              </button>
            </div>
            {apiResponse && (
              <div className="mt-4">
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
