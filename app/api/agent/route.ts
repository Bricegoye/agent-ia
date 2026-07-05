    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          { role: "system", content: ANALYTICS_SYSTEM_PROMPT },
          { role: "user", content: enrichedInput },
        ],
      }),
    });

    const data = await response.json();

    console.log("========== OPENAI ==========");
    console.log("HTTP Status :", response.status);
    console.log("Response OK :", response.ok);
    console.log("Réponse OpenAI :");
    console.log(JSON.stringify(data, null, 2));

    return NextResponse.json({
      httpStatus: response.status,
      success: response.ok,
      raw: data,
    });
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json(
      { error: "Erreur interne serveur." },
      { status: 500 }
    );
  }
}