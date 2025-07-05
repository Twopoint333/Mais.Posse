'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { identifyIngredients, IdentifyIngredientsOutput } from '@/ai/flows/identify-ingredients';
import { generateRecipes, GenerateRecipesOutput } from '@/ai/flows/generate-recipes';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChefHat, Camera, Loader2, Soup, RotateCw, Sparkles, XCircle } from 'lucide-react';

type Recipe = GenerateRecipesOutput['recipes'][0];

export default function Home() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [ingredientsResult, setIngredientsResult] = useState<IdentifyIngredientsOutput | null>(null);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target?.result as string;
      setPhotoDataUri(dataUri);
      resetSecondaryStates();
      setIsIdentifying(true);
      try {
        const result = await identifyIngredients({ photoDataUri: dataUri });
        setIngredientsResult(result);
      } catch (err) {
        setError('Could not identify ingredients. Please try again.');
        console.error(err);
      } finally {
        setIsIdentifying(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateRecipes = async () => {
    if (!ingredientsResult?.ingredients || ingredientsResult.ingredients.length === 0) return;
    setIsGenerating(true);
    setError(null);
    setRecipes(null);
    try {
      const result = await generateRecipes({ ingredients: ingredientsResult.ingredients });
      setRecipes(result.recipes);
    } catch (err) {
      setError('Could not generate recipes. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const resetAll = () => {
    setPhotoDataUri(null);
    resetSecondaryStates();
  };
  
  const resetSecondaryStates = () => {
    setIngredientsResult(null);
    setRecipes(null);
    setError(null);
    setIsIdentifying(false);
    setIsGenerating(false);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  const renderInitialView = () => (
    <div
      className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/50 rounded-lg cursor-pointer hover:border-primary transition-colors duration-300 bg-primary/5"
      onClick={triggerFileSelect}
    >
      <Camera className="w-16 h-16 text-primary/80 mb-4" />
      <h2 className="text-2xl font-bold text-center">Snap Your Ingredients</h2>
      <p className="text-muted-foreground text-center mt-2">Upload a photo and we'll whip up some recipe ideas!</p>
      <Button className="mt-6" size="lg">Upload Photo</Button>
    </div>
  );

  const renderIngredients = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="text-accent" /> Identified Ingredients
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ingredientsResult?.isFood && ingredientsResult.ingredients.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {ingredientsResult.ingredients.map((ingredient) => (
                <Badge key={ingredient} variant="secondary" className="text-lg py-1 px-3 bg-accent/20 border-accent/50">{ingredient}</Badge>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleGenerateRecipes} disabled={isGenerating} size="lg">
                {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Recipes...</> : 'Generate Recipes'}
              </Button>
              <Button onClick={resetAll} variant="outline" size="lg">
                <RotateCw className="mr-2 h-4 w-4" /> Try another photo
              </Button>
            </div>
          </>
        ) : (
          <div>
            <p className="text-lg text-muted-foreground mb-4">
              {ingredientsResult && !ingredientsResult.isFood 
                ? "We couldn't be sure this is food. Please try a clearer photo."
                : "No ingredients were identified. Please try another photo."}
            </p>
            <Button onClick={resetAll} variant="outline" size="lg">
              <RotateCw className="mr-2 h-4 w-4" /> Try again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderRecipes = () => (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Your Recipe Suggestions</h2>
        <p className="text-muted-foreground mt-2">Bon appétit! Here are some ideas based on your ingredients.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {recipes?.map((recipe) => (
          <Card key={recipe.name} className="flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-start gap-3">
                <Soup className="w-7 h-7 text-primary flex-shrink-0 mt-1" />
                <span>{recipe.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{recipe.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <Button onClick={resetAll} size="lg" variant="default">
          <RotateCw className="mr-2 h-4 w-4" /> Start Over
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-body">
      <header className="py-6 px-4">
        <div className="container mx-auto flex items-center justify-center gap-3">
          <ChefHat className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Recipe Snap</h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Oops! Something went wrong.</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!photoDataUri && renderInitialView()}

          {photoDataUri && (
            <div className="relative w-full max-w-xl mx-auto aspect-video rounded-lg overflow-hidden shadow-2xl border-4 border-card">
              <Image src={photoDataUri} alt="Uploaded ingredients" layout="fill" objectFit="cover" />
              {isIdentifying && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white z-10">
                  <Loader2 className="h-12 w-12 animate-spin mb-4" />
                  <p className="text-xl font-semibold">Identifying ingredients...</p>
                </div>
              )}
            </div>
          )}

          {photoDataUri && !isIdentifying && ingredientsResult && !recipes && renderIngredients()}
          
          {recipes && renderRecipes()}
          
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>Built with Firebase and Genkit</p>
      </footer>
    </div>
  );
}
