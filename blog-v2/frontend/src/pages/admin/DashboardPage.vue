<template>
  <section>
    <h1>Blog V2 / Administração</h1>
    <p class="admin-muted">Organize seus artigos e acompanhe o que está publicado.</p>
    <div class="admin-dashboard">
      <RouterLink class="admin-panel" :to="{ name: 'admin-posts' }"><h2>Posts</h2><p>Consulte, edite e gerencie suas publicações.</p></RouterLink>
      <RouterLink class="admin-panel" :to="{ name: 'admin-new' }"><h2>Novo post</h2><p>Comece um artigo como rascunho.</p></RouterLink>
    </div>
  </section>
</template>
