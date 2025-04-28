import ProtectedRoute from "@/app/components/protectedRoute/ProtectedRoute";
import Favorite from "@/app/components/store/favorite/Favorite";
import React from "react";

function FavoritePage() {
  return (
    <ProtectedRoute>
      <Favorite />
    </ProtectedRoute>
  );
}

export default FavoritePage;
