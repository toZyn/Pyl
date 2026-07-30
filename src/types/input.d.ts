declare module "input" {
  const input: {
    text(message: string): Promise<string>;
    select(message: string, choices: string[]): Promise<number>;
  };
  export default input;
}
