{user ? (
  <div className="flex flex-col gap-2">
    <p className="text-foreground font-medium py-2">Bonjour {prenom} !</p>
    <a href="/mon-compte" className="text-foreground py-2 text-sm">Mon compte</a>
    <a href="/mes-commandes" className="text-foreground py-2 text-sm">Mes commandes</a>
    <button
      onClick={handleLogout}
      className="text-red-500 font-medium py-2 text-left text-sm"
    >
      Déconnexion
    </button>
  </div>
    {/* Menu déroulant */}
    <div className="absolute top-8 right-0 bg-white rounded-2xl shadow-lg border border-border py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      
        href="/mon-compte"
        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
      >
        <User size={15} className="text-primary" />
        Mon compte
      </a>
      
        href="/mes-commandes"
        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
      >
        <ShoppingBag size={15} className="text-primary" />
        Mes commandes
      </a>
      <div className="border-t border-border my-1" />
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
      >
        <LogOut size={15} />
        Déconnexion
      </button>
    </div>
  </div>