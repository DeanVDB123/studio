
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">
            Thank you for ascending!
          </CardTitle>
          <CardDescription>
            Add your details below and immortalize your loved ones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">
              Payment form will be displayed here.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">
            <CreditCard className="mr-2 h-5 w-5" />
            Proceed to Pay
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
