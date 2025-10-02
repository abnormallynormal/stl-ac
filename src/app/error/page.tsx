export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          Authentication Error
        </h1>
        <p className="text-muted-foreground mb-6">
          There was an issue with your authentication. Please try again or contact support.
        </p>
        <a 
          href="/login" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}