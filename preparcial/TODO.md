# Implementation TODO

## Step 1: Update Types (types/actor.ts)
- [ ] Add Prize interface
- [ ] Update Movie interface to include prizes array
- [ ] Update Actor interface to include movies array

## Step 2: Create Movies API
- [ ] Create movies route: GET, POST
- [ ] Create movies/[id] route: GET, PUT, DELETE

## Step 3: Create Prizes API
- [ ] Create prizes route: GET, POST
- [ ] Create prizes/[id] route: GET, PUT, DELETE

## Step 4: Create Association Routes
- [ ] Create actor-movie association: POST /actors/:actorId/movies/:movieID
- [ ] Create movie-prize association: POST /movies/:movieId/prizes/:prizeID

## Step 5: Create MovieContext
- [ ] Create MovieContext.tsx for movies and prizes management

## Step 6: Update Components
- [ ] Fix and update MovieForm.tsx
- [ ] Create MovieList component
- [ ] Create PrizeForm component

## Step 7: Create Pages
- [ ] Create movies list page
- [ ] Create prizes page

## Step 8: Update Navbar
- [ ] Add navigation to Movies and Prizes

