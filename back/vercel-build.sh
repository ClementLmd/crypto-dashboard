#!/bin/bash
cd /shared && pnpm install && pnpm build
cd ../back && pnpm install && pnpm build 