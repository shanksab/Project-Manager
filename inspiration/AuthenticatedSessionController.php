<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider; // Normalement utilisé pour la redirection web
use Illuminate\Http\Request;
use Illuminate\Http\Response;          // Pour le type de retour de destroy()
use Illuminate\Http\JsonResponse;      // Pour le type de retour de store() pour l'API
use Illuminate\Http\RedirectResponse;  // Pour le type de retour de store() pour le web
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     * Note: Cette méthode est pour le web et n'est généralement pas utilisée par une API pure.
     * Breeze l'inclut par défaut.
     */
    public function create(): \Illuminate\View\View // Ou un autre type de retour si vous utilisez Inertia/Livewire
    {
        return view('auth.login'); // Concerne l'affichage d'une page de login web
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse|RedirectResponse // Modifié pour retourner JsonResponse ou RedirectResponse
    {
        $request->authenticate(); // Valide les identifiants et tente d'authentifier

        $request->session()->regenerate(); // Régénère la session (bon pour la sécurité web)

        // Vérifier si la requête attend une réponse JSON (typique pour une API)
        if ($request->wantsJson()) {
            /** @var \App\Models\User $user */
            $user = Auth::user(); // Récupère l'utilisateur authentifié

            // Crée un token Sanctum pour cet utilisateur
            // Le nom du token ('api-login-token' ici) est pour votre référence
            $token = $user->createToken('api-login-token-' . $user->id)->plainTextToken;

            // Retourne une réponse JSON avec le token et éventuellement les infos de l'utilisateur
            return response()->json([
                'message' => 'Login successful',
                'user' => $user, // Optionnel: vous pouvez choisir de retourner les infos de l'utilisateur
                'token_type' => 'Bearer',
                'access_token' => $token,
            ]); // Le statut HTTP sera 200 OK par défaut
        }

        // Comportement par défaut pour les requêtes web (redirection)
        // Si votre backend est une API PURE, cette partie pourrait ne jamais être atteinte
        // si toutes les requêtes spécifient 'Accept: application/json'.
        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response|JsonResponse // Modifié pour potentiellement retourner JsonResponse
    {
        Auth::guard('web')->logout(); // Déconnecte l'utilisateur de la session web

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        // Pour une API, il faut aussi invalider les tokens Sanctum si l'on veut une déconnexion complète
        // et que le token actuel ne soit plus utilisable.
        if ($request->wantsJson()) {
            // Invalider le token Sanctum actuel si l'utilisateur est authentifié via Sanctum
            if ($request->user() && $request->user()->currentAccessToken()) {
                 $request->user()->currentAccessToken()->delete();
            }
            return response()->json(['message' => 'Successfully logged out']); // Ou response()->noContent();
        }

        // Réponse pour une déconnexion web
        // return redirect('/'); // Redirige vers la page d'accueil pour le web
        return response()->noContent(); // Ou noContent si c'est le comportement souhaité par Breeze pour le non-JSON ici
    }
}